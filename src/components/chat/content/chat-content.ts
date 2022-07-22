import { computed, ComputedRef, ref } from 'vue'
import { useStringPathParamReactive } from '@/components/helpers/route'
import { ChatMessagesListItem, MessagesQueryParams, SimpleChatMessage, ChatArchive } from '@/types/chat.model'
import useChatController from '@/middleware/controllers/useChatController'
import useChatStore from '@/store/chat'
import useUserStore from '@/store/user'
import useWebsocket from '@/middleware/websockets/useWebsocket'

const chatsMessagesFetching = new Set<string>()

export default function useChatContent() {
  const chatId = useStringPathParamReactive('chatId')
  const { fetchMessages } = useChatController()
  const { getMyId, getMyProfile } = useUserStore()
  const { deleteMessage, markMessageSeen } = useWebsocket()
  const {
    getActiveChat,
    getActiveChatMessages,
    getOldestMessagesLoaded,
    getArchiveState,
    isOldestChatLoaded,
    viewChatsLoadingState,
    scrollContainer,
    setMessageResponseTo,
    setOldestMessageLoaded,
    scrollToChatBottom,
  } = useChatStore()

  const messagesPerLoad = 16
  const isOlderMessagesError = ref(false)
  const getOlderMessagesError = computed(() => isOlderMessagesError.value)
  const isSidebarChatsError = computed(() => viewChatsLoadingState.state === 'error')

  const olderThanId = () => {
    const messagesCount = getActiveChatMessages.value?.length
    if (!messagesCount) return

    const olderThanId = getActiveChatMessages.value[0]?.id
    return olderThanId
  }

  const _fetchMessages = async (params: MessagesQueryParams) => {
    chatsMessagesFetching.add(chatId.value)
    try {
      const messagesFetched = await fetchMessages(chatId.value, params)
      return messagesFetched
    } finally {
      chatsMessagesFetching.delete(chatId.value)
    }
  }

  const restoreScrollPosition = (oldestMessageId?: string) => {
    const el = document.getElementById(oldestMessageId || '')

    if ('ResizeObserver' in window) {
      const container = scrollContainer.value
      if (!container) return
      const prevScrollHeight = container.scrollHeight || 0
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resizeObserver = (window as any).ResizeObserver as any

      const observer = new resizeObserver(() => {
        if (container?.scrollHeight !== prevScrollHeight) {
          scrollContainer.value?.scrollTo({
            top: (container?.scrollHeight || 0) - prevScrollHeight,
          })
          observer.disconnect()
        }
      })

      for (let i = 0; i < container?.children?.length; i++) {
        observer.observe(container?.children[i])
      }
    }
    el?.scrollIntoView()
  }

  const fetchOlderMessages = () => {
    if (getOldestMessagesLoaded.value || chatsMessagesFetching.has(chatId.value)) return

    isOlderMessagesError.value = false
    const limit = messagesPerLoad
    const params: MessagesQueryParams = {
      limit,
      olderThanId: olderThanId(),
    }

    const messages = getActiveChatMessages.value

    return _fetchMessages(params)
      .then((response) => {
        const oldestMessage = messages[0]

        restoreScrollPosition(oldestMessage?.id)

        const messagesOrdered = response.data.messages.reverse()
        messages.unshift(...messagesOrdered)
        if (messagesOrdered.length < limit) setOldestMessageLoaded(true)
      })
      .catch(() => (isOlderMessagesError.value = true))
  }

  const getChatArchiveState = (): ComputedRef<ChatArchive | null> =>
    computed(() => {
      return getArchiveState.value
    })

  const getChatMessages = (): ComputedRef<ChatMessagesListItem[]> =>
    computed(() => {
      if (!getActiveChatMessages.value?.length) return []

      const chatMessages = getActiveChatMessages.value
      const messages: ChatMessagesListItem[] = []
      let previousMessageUserId = chatMessages[0].userId
      let messagesSerial: SimpleChatMessage[] = [chatMessages[0]]
      const otherUsers: (string | null)[] = []

      for (let i = 1; i < chatMessages.length; i++) {
        const message = chatMessages[i]
        const userChanged = message.userId !== previousMessageUserId
        const otherUserIndex = otherUsers.indexOf(message.userId)
        if (otherUserIndex === -1 && getMyId.value !== message.userId && message.type !== 'SYSTEM') {
          otherUsers.push(message.userId)
        }

        if (userChanged) {
          messages.push({
            id: chatMessages[i - 1].id,
            ofCurrentUser: getMyId.value === previousMessageUserId,
            messages: messagesSerial,
            otherUsers: otherUsers,
          })
          messagesSerial = []
        }

        messagesSerial.push(message)
        previousMessageUserId = message.userId
      }

      const lastChatMessage = chatMessages[chatMessages.length - 1]
      if (messagesSerial[messagesSerial.length - 1] !== lastChatMessage) {
        messagesSerial.push(lastChatMessage)
      }

      const messagesLength = messages.length
      if (messages[messagesLength - 1]?.messages !== messagesSerial) {
        messages[messagesLength] = {
          id: lastChatMessage.id,
          messages: messagesSerial,
          ofCurrentUser: previousMessageUserId === getMyId.value,
          otherUsers: otherUsers,
        }
      }

      return messages
    })

  const setResponseMessage = (message: SimpleChatMessage) => {
    setMessageResponseTo(message)
    const inputElementId = window.innerWidth <= 767 ? 'send-message-input' : 'desktop-send-message-input'
    const inputElement = document.getElementById(inputElementId)
    inputElement?.focus()
  }

  const removeMessage = (message: SimpleChatMessage) => {
    const messageChatId = chatId.value

    if (message && messageChatId) deleteMessage(messageChatId, message.id)
  }

  const onScrolledToTop = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    e.preventDefault()
    if (target.scrollTop === 0 && !chatsMessagesFetching.has(chatId.value)) {
      fetchOlderMessages()
    }
  }

  const markLatestMassageRead = () => {
    const messages = getActiveChatMessages.value
    const lastMessage = messages[messages.length - 1]

    if (lastMessage) {
      markMessageSeen(lastMessage.chatId, lastMessage.id)
    }
  }

  return {
    isOldestChatLoaded,
    currentUserId: getMyId,
    getActiveChat,
    getActiveChatMessages,
    getOlderMessagesError,
    isSidebarChatsError,
    scrollContainer,
    getMyProfile,
    getChatMessages,
    setResponseMessage,
    removeMessage,
    fetchOlderMessages,
    markLatestMassageRead,
    onScrolledToTop,
    scrollToChatBottom,
    getChatArchiveState,
  }
}
