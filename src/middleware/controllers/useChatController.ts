import api, { paramsToQueryString } from '@/services/api'
import {
  ChatMessagesResponse,
  ChatQueryParams,
  ChatsResonse,
  MessagesQueryParams,
  SimpleChat,
} from '@/types/chat.model'

export default function useChatController() {
  const createChat = async (proposalId: string) => {
    return await api.post<SimpleChat>(`chats/?proposalId=${proposalId}`)
  }

  const fetchChats = async (params: ChatQueryParams) => {
    return await api.get<ChatsResonse>(`chats/${paramsToQueryString(params)}`)
  }

  const fetchChat = async (id: string) => {
    return await api.get<SimpleChat>(`chats/${id}`)
  }

  const fetchMessages = async (chatId: string, params: MessagesQueryParams) => {
    return await api.get<ChatMessagesResponse>(`chats/${chatId}/messages/${paramsToQueryString(params)}`)
  }

  const archiveChat = async (chatId: string) => {
    return await api.post<Record<string, never>>(`chats/${chatId}/archive`)
  }

  const unarchiveChat = async (chatId: string) => {
    return await api.post<Record<string, never>>(`chats/${chatId}/unarchive`)
  }

  return {
    createChat,
    fetchChat,
    fetchChats,
    fetchMessages,
    archiveChat,
    unarchiveChat,
  }
}
