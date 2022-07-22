import { computed, nextTick, reactive, ref } from 'vue'
import { ChatFileUploadPayload, ChatPanelPayload, SimpleChat, SimpleChatMessage } from '@/types/chat.model'
import { ApiLoadingState, EntitiesLoadingState } from '@/types/api.model'
import { scrollToPageBottom } from '@/components/helpers/dom'
import { ChatArchive } from '@/types/chat.model'
import useUserStore from './user'

const chatMessagesCache = new Map<string, SimpleChatMessage[]>()
const chatPayloadCache = new Map<string, ChatPanelPayload>()
const sidebarChats = ref<Array<SimpleChat>>([])
const areAllChatsLoaded = ref(false)
const activeChatId = ref<string | null>(null)
const activeChat = ref<SimpleChat | null>(null)
const isFetchingDialogs = ref(false)
const viewChatsLoadingState = reactive<EntitiesLoadingState>({
  state: 'loading',
  payload: {
    message: undefined,
  },
})
const scrollContainer = ref<HTMLElement | null>(null)
const activeChatMessages = ref<SimpleChatMessage[]>([])
const messageResponseTo = ref<SimpleChatMessage | null>(null)
const inputMessageText = ref<string>('')
const inputMessageUploadFiles = ref<ChatFileUploadPayload[]>([])
const oldestMessagesLoaded = ref<boolean>(false)
const archiveState = ref<ChatArchive | null>(null)
const { getMyId } = useUserStore()

const reset = () => {
  chatMessagesCache.clear()
  chatPayloadCache.clear()
  sidebarChats.value = []
  activeChat.value = null
  viewChatsLoadingState.state = 'loading'
  viewChatsLoadingState.payload = { message: undefined }
  activeChatMessages.value = []
  messageResponseTo.value = null
  inputMessageText.value = ''
  inputMessageUploadFiles.value = []
  oldestMessagesLoaded.value = false
  archiveState.value = null
  isFetchingDialogs.value = false
}

const scrollToChatBottom = () => {
  const container = scrollContainer.value
  if (!container) return

  container.scrollTo({ top: container.scrollHeight })
}

const clearState = () => {
  activeChatId.value = null
  activeChat.value = null
  activeChatMessages.value = []
  inputMessageText.value = ''
  inputMessageUploadFiles.value = []
  messageResponseTo.value = null
  archiveState.value = null
}

const replaceMessage = (message: SimpleChatMessage, chatId: string) => {
  let messages: SimpleChatMessage[] | null = null

  const cached = chatMessagesCache.get(chatId)
  if (cached) messages = cached
  if (!cached && activeChat.value?.id === message.chatId) messages = activeChatMessages.value

  const messageIndex = messages?.findIndex(({ id }) => id === message.id)

  if (messageIndex && messageIndex !== -1) messages?.splice(messageIndex, 1, message)
}

const addMessage = (message: SimpleChatMessage) => {
  const cached = chatMessagesCache.get(message.chatId)
  if (cached) cached?.push(message)
  if (!cached && activeChat.value?.id === message.chatId) {
    activeChatMessages.value?.push(message)
  }

  if (!cached && activeChat.value?.id !== message.chatId && message.chatId) {
    const chatCache = reactive([message])
    chatMessagesCache.set(message.chatId, chatCache)
  }

  let messageChat: SimpleChat | null = null

  if (activeChat.value?.id === message.chatId && activeChat.value?.id) {
    messageChat = activeChat.value

    const container = scrollContainer.value
    const isScrolledToBottom =
      Math.abs((container?.scrollHeight || 0) - ((container?.scrollTop || 0) + (container?.offsetHeight || 0))) < 8
    if (isScrolledToBottom || message.userId === getMyId?.value) {
      setTimeout(scrollToChatBottom)
    }
  }
  const cachedChat = sidebarChats.value?.find(({ id }) => message.chatId === id)
  if (!messageChat && cachedChat) messageChat = cachedChat
  if (messageChat) messageChat.lastMessage = message
}

const updateArchivedChat = (data: ChatArchive) => {
  const chat = sidebarChats.value.find((chat) => chat.id === data.chatId)
  if (chat) {
    chat.archivedByUserId = data.archivedByUserId
  }
}

const addMyMessage = (message: SimpleChatMessage) => {
  addMessage(message)
  nextTick(scrollToPageBottom)
}

const closeChat = () => {
  const activeChatPayload: ChatPanelPayload = {
    inputMessageText: inputMessageText.value,
    responseMessage: messageResponseTo.value,
    oldestMessagesLoaded: oldestMessagesLoaded.value,
    uploadFiles: inputMessageUploadFiles.value,
  }
  if (activeChat.value?.id) {
    chatPayloadCache.set(activeChat.value.id, activeChatPayload)
  }
  inputMessageText.value = ''
  messageResponseTo.value = null
  oldestMessagesLoaded.value = false
  inputMessageUploadFiles.value = []
}

const restoreChatFromCache = (chatId: string) => {
  const chatDataCache = chatPayloadCache.get(chatId)

  if (chatDataCache) {
    inputMessageText.value = chatDataCache.inputMessageText || ''
    messageResponseTo.value = chatDataCache.responseMessage || null
    oldestMessagesLoaded.value = chatDataCache.oldestMessagesLoaded || false
    inputMessageUploadFiles.value = chatDataCache.uploadFiles
  }
}

const setActiveChat = (chat: SimpleChat | null) => {
  if (activeChat.value) closeChat()
  if (activeChat.value?.id && activeChatMessages?.value?.length) {
    chatMessagesCache.set(activeChat.value.id, activeChatMessages.value)
  }

  activeChat.value = chat
  activeChatMessages.value = []

  const chatMessages = chatMessagesCache.get(chat?.id || '')

  if (chat?.id && chatMessages) activeChatMessages.value = chatMessages
  if (chat?.lastMessage && !chatMessages) activeChatMessages.value.push(chat.lastMessage)

  if (activeChat.value?.id) restoreChatFromCache(activeChat.value.id)
}

const findAndSetActiveChat = () => {
  if (!activeChatId.value) return

  const chatId = activeChatId.value
  const activeChat = sidebarChats.value?.find((chat) => chat.id === chatId)
  if (activeChat) setActiveChat(activeChat)
  if (!activeChat) setActiveChat(null)
}

const addNewChat = (chat: SimpleChat) => {
  sidebarChats.value.unshift(chat)

  findAndSetActiveChat()
}

const setActiveChatMessages = (messages: SimpleChatMessage[]) => {
  if (!activeChat.value) return

  chatMessagesCache.set(activeChat.value.id, messages)
  activeChatMessages.value = messages
}

const setArchiveState = (messages: ChatArchive) => {
  if (!archiveState.value) return

  archiveState.value = messages
}

const updateChatUnreadMessagesCount = (chatId: string, count: number) => {
  const chat = sidebarChats.value.find((chat) => chat.id === chatId)
  if (!chat) return
  chat.unreadMessages = count
}

const setOldestChatLoadedState = (state: boolean) => {
  areAllChatsLoaded.value = state
}

const setSidebarChats = (chats: Array<SimpleChat>) => {
  sidebarChats.value = chats
}

const setMessageResponseTo = (message: SimpleChatMessage | null) => {
  messageResponseTo.value = message
}

const setOldestMessageLoaded = (value: boolean) => {
  oldestMessagesLoaded.value = value
}

const setFileUploadEntries = (value: ChatFileUploadPayload[]) => {
  inputMessageUploadFiles.value = value

  const cache = chatPayloadCache.get(activeChat.value?.id || '')
  if (cache && activeChat.value?.id) {
    cache.uploadFiles = value
  }
}

const setSidebarChatsLoadingState = (state: ApiLoadingState, payload?: { message?: string }) => {
  viewChatsLoadingState.state = state
  viewChatsLoadingState.payload = payload
}

const setActiveChatId = (chatId: string | null) => {
  activeChatId.value = chatId
}

export default function useChatStore() {
  const getSidebarChats = computed(() =>
    sidebarChats.value.sort((chat1, chat2) => {
      const chat1LastMessage = chat1.lastMessage
      const chat2LastMessage = chat2.lastMessage

      const chat1LastMessageData = new Date(chat1LastMessage.date).valueOf()
      const chat2LastMessageData = new Date(chat2LastMessage.date).valueOf()

      return chat2LastMessageData - chat1LastMessageData
    })
  )
  const getActiveChatMessages = computed(() => activeChatMessages.value)
  const getMessageResponseTo = computed(() => messageResponseTo.value)
  const getActiveChat = computed(() => activeChat.value)
  const getOldestMessagesLoaded = computed(() => oldestMessagesLoaded.value)
  const getFileUploadEntries = computed(() => inputMessageUploadFiles.value)
  const isOldestChatLoaded = computed(() => areAllChatsLoaded.value)
  const getArchiveState = computed(() => archiveState.value)

  return {
    scrollContainer,
    chatPayloadCache,
    chatMessagesCache,
    getActiveChat,
    getActiveChatMessages,
    getOldestMessagesLoaded,
    getMessageResponseTo,
    getFileUploadEntries,
    isFetchingDialogs,
    activeChatMessages,
    inputMessageText,
    getSidebarChats,
    isOldestChatLoaded,
    viewChatsLoadingState,
    getArchiveState,
    reset,
    setActiveChat,
    clearState,
    findAndSetActiveChat,
    setActiveChatId,
    setActiveChatMessages,
    setArchiveState,
    setMessageResponseTo,
    setOldestMessageLoaded,
    setFileUploadEntries,
    setSidebarChatsLoadingState,
    setOldestChatLoadedState,
    addNewChat,
    addMyMessage,
    addMessage,
    replaceMessage,
    setSidebarChats,
    updateChatUnreadMessagesCount,
    scrollToChatBottom,
    updateArchivedChat,
    archiveState,
  }
}
