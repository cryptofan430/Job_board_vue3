import useChatController from '@/middleware/controllers/useChatController'
import useChatStore from '@/store/chat'
import { ChatQueryParams } from '@/types/chat.model'

export default function useChats() {
  const chatsPerLoad = 2 ** 28

  const { getSidebarChats, isFetchingDialogs, setSidebarChats, setOldestChatLoadedState, setSidebarChatsLoadingState } =
    useChatStore()
  const { fetchChats } = useChatController()

  const _fetchSidebarChats = async () => {
    const chatsCount = getSidebarChats.value?.length || 0

    const chatQueryPayload: ChatQueryParams = {
      limit: chatsPerLoad,
      lastMessageIdOlderThan: getSidebarChats.value[chatsCount - 1]?.lastMessage?.id,
    }

    isFetchingDialogs.value = true

    return await fetchChats(chatQueryPayload)
      .then((response) => {
        setSidebarChatsLoadingState('loaded')
        const newChats = [...getSidebarChats.value, ...response.data.chats]
        setSidebarChats(newChats)

        if (response.data.chats?.length < chatsPerLoad) setOldestChatLoadedState(true)
      })
      .catch(() => {
        setSidebarChatsLoadingState('error')
      })
      .finally(() => {
        isFetchingDialogs.value = false
      })
  }

  return {
    _fetchSidebarChats,
  }
}
