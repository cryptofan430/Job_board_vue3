import { onBeforeUnmount, watch, watchEffect } from 'vue'
import { extractEntitiesLoadingState } from '@/components/helpers/state'
import useChatStore from '@/store/chat'
import { useStringPathParamReactive } from '@/components/helpers/route'
import useChats from './use-chats'

export default function useChatSidebar() {
  const chatId = useStringPathParamReactive('chatId')

  const {
    getSidebarChats,
    getActiveChat,
    viewChatsLoadingState,
    isOldestChatLoaded,
    isFetchingDialogs,
    findAndSetActiveChat,
    setActiveChatId,
    clearState,
  } = useChatStore()
  const { isLoading, isError, isLoaded } = extractEntitiesLoadingState(viewChatsLoadingState)
  const { _fetchSidebarChats } = useChats()

  const watchActiveChatUrl = () => {
    setActiveChatId(chatId.value)

    watch(chatId, () => {
      setActiveChatId(chatId.value)
      findAndSetActiveChat()
    })

    onBeforeUnmount(() => clearState())
  }

  const initSidebarChats = () => {
    watchEffect(() => {
      findAndSetActiveChat()
    })
  }

  const onScrolledToBottom = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (
      target.scrollHeight === Math.round(target.scrollTop) + target.clientHeight &&
      !isFetchingDialogs.value &&
      !isOldestChatLoaded.value
    ) {
      _fetchSidebarChats()
    }
  }

  return {
    chatId,
    isLoading,
    isError,
    isLoaded,
    isOldestChatLoaded,
    getSidebarChats,
    getActiveChat,
    initSidebarChats,
    findAndSetActiveChat,
    watchActiveChatUrl,
    onScrolledToBottom,
  }
}
