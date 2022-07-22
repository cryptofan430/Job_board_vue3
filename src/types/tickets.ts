import { BasicPagination, PaginationWithPage } from './api.model'

export enum TicketState {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export interface TicketPublicInfo {
  id: string
  description: string
  chatId: string
  state: TicketState
  createdDate: string
}

export interface TicketUiPublicInfo extends TicketPublicInfo {
  closeInProgress?: boolean
}

export interface TicketsPublicResponse {
  tickets: Array<TicketPublicInfo>
  count: number
}

export interface CreateSettingTicketPayload {
  description: string
}

export interface CloseMyTicketPayload {
  id: string
}

export enum CreateTicketError {
  OPEN_TICKET_ALREADY_EXIST = 'OPEN_TICKET_ALREADY_EXIST',
  DAILY_LIMIT_REACHED = 'DAILY_LIMIT_REACHED',
}

export enum TicketCloseError {
  TICKET_NOT_EXIST = 'TICKET_NOT_EXIST',
  TICKET_NOT_BELONG_TO_USER = 'TICKET_NOT_BELONG_TO_USER',
  TICKET_ALREADY_CLOSED = 'TICKET_ALREADY_CLOSED',
}

export enum TicketCloseByAdminError {
  TICKET_NOT_EXIST = 'TICKET_NOT_EXIST',
  TICKET_ALREADY_CLOSED = 'TICKET_ALREADY_CLOSED',
}

export interface TicketAdminInfo extends TicketPublicInfo {
  joinedChat: boolean
  isAdminInChat: boolean
  userId: string
}

export interface AdminTicketUiInfo extends TicketAdminInfo {
  closeInProgress?: boolean
  joinInProgress?: boolean
}

export interface TicketsAdminResponse {
  tickets: TicketAdminInfo
  count: number
}

export interface AdminTicketsFilters {
  state?: TicketState
  isAdminInChat?: boolean
  haveIJoined?: boolean
}

export enum AdminJoinTicketChatError {
  TICKET_NOT_EXIST = 'TICKET_NOT_EXIST',
  TICKET_ALREADY_CLOSED = 'TICKET_ALREADY_CLOSED',
}

export type AdminTicketsPagination = AdminTicketsFilters & BasicPagination & PaginationWithPage
