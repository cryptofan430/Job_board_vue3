import api, { paramsToQueryString } from '@/services/api'
import { BasicPagination } from '@/types/api.model'
import {
  AdminTicketsFilters,
  CreateSettingTicketPayload,
  TicketAdminInfo,
  TicketPublicInfo,
  TicketsPublicResponse,
} from '@/types/tickets'

const createTicket = (ticketData: CreateSettingTicketPayload) => {
  return api.post<TicketPublicInfo>(`/tickets/${paramsToQueryString(ticketData)}`)
}

const fetchMyTickets = (pagination?: BasicPagination) => {
  return api.get<TicketsPublicResponse>(`/tickets/my/${paramsToQueryString(pagination)}`)
}

const closeMyTicket = (id: string) => {
  return api.post<TicketPublicInfo>(`/tickets/${id}/close-by-user`)
}

const fetchAdminTickets = (filters?: AdminTicketsFilters) => {
  return api.get(`/tickets/${paramsToQueryString(filters)}`)
}

const adminJoinChat = (ticketId: string) => {
  return api.post<TicketAdminInfo>(`/tickets/${ticketId}/join-chat`)
}

const adminLeaveChat = (ticketId: string) => {
  return api.post<TicketAdminInfo>(`/tickets/${ticketId}/leave-chat`)
}

const adminCloseTicket = (ticketId: string) => {
  return api.post<TicketAdminInfo>(`/tickets/${ticketId}/close-by-admin`)
}

export default function useTicketsController() {
  return {
    createTicket,
    fetchMyTickets,
    closeMyTicket,
    fetchAdminTickets,
    adminJoinChat,
    adminLeaveChat,
    adminCloseTicket,
  }
}
