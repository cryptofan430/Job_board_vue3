import { MyTasksQueryParams, TasksQueryParams } from '@/types/tasks.model'
import { ChatQueryParams, MessagesQueryParams } from './chat.model'
import { InvitaionParams } from './invitation.model'
import { InvitationsParams } from './platform.model'
import { AdminTicketsFilters, CreateSettingTicketPayload } from './tickets'
import { TransactionDownloadFilesParams } from './transaction.model'

export type QueryParams =
  | TasksQueryParams
  | InvitaionParams
  | ChatQueryParams
  | MessagesQueryParams
  | MyTasksQueryParams
  | TwitchOAuthParams
  | TikTocOAuthParams
  | YoutubeOAuthParams
  | CreateSettingTicketPayload
  | FacebookOAuthParams
  | InvitationsParams
  | AdminTicketsFilters
  | TransactionDownloadFilesParams

export type ApiErrors = Array<ApiError>

interface ApiError {
  errorType: string
  message: string
}

export type ApiLoadingState = 'loaded' | 'error' | 'loading'

export interface PaginationNewerOlder {
  newerThanId?: string
  olderThanId?: string
}

export interface BasicPagination extends PaginationNewerOlder {
  skip: number
  limit: number
}

export interface PaginationPages {
  targetPage?: number
  currentPage?: number
}

export type PaginationWithPage = BasicPagination & PaginationPages
export type PaginationPayload = PaginationPages & PaginationNewerOlder

export interface EntitiesLoadingState {
  state: ApiLoadingState
  payload?: {
    message?: string
  }
}

export interface TwitchOAuthParams {
  client_id: string
  redirect_uri: string
  response_type: string
  scope: string
  force_verify?: boolean
}

export interface TikTocOAuthParams {
  client_key: string
  redirect_uri: string
  response_type: string
  scope: string
}

export interface YoutubeOAuthParams {
  client_id: string
  redirect_uri: string
  response_type: string
  scope: string
  access_type: string
  force_verify?: boolean
}

export interface FacebookOAuthParams {
  client_id: string
  redirect_uri: string
  response_type: string
  scope: string
  display: string
  access_type: string
  force_confirmation?: boolean
}
