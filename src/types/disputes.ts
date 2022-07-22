import { BasicPagination } from './api.model'
import { ContractWithTask } from './contract.model'
import { CurrencyMoney } from './money.model'
import { UserStatePublicInfo } from './user.model'

export enum DisputeState {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export interface DisputePublicInfo {
  id: string
  milestoneId: string
  chatId: string
  projectName: string
  milestoneName: string
  contractId: string
  taskId: string
  state: DisputeState
  milestoneValueAfterDispute: CurrencyMoney
}

export interface DisputesPublicResponse {
  disputes: Array<DisputePublicInfo>
  count: number
}

export interface DisputeAdminInfo extends DisputePublicInfo {
  userIds: Array<string>
  joinedDisputeChat: boolean
  joinedRegularChat: boolean
  isAdminInChat: boolean
}

export interface DisputeAdminUiInfo extends DisputeAdminInfo {
  isJoiningRegularChat?: boolean
  isJoiningDisputeChat?: boolean
}

export interface AdminDisputeFilters {
  state?: DisputeState
  isAdminInChat?: boolean
  haveIJoined?: boolean
}

export interface DisputesAdminResponse {
  disputes: Array<DisputeAdminInfo>
  count: number
}

export interface CreateDisputeForm {
  amountToInfluencer: number
  description: string
}

export enum CreateDisputeError {
  CONTRACT_NOT_EXIST = 'CONTRACT_NOT_EXIST',
  MILESTONE_NOT_EXIST = 'MILESTONE_NOT_EXIST',
  UNABLE_TO_DISPUTE_NOT_SECURED_MILESTONE = 'UNABLE_TO_DISPUTE_NOT_SECURED_MILESTONE',
  DISPUTE_ALREADY_EXIST = 'DISPUTE_ALREADY_EXIST',
  CONTRACT_NOT_BELONG_TO_USER = 'CONTRACT_NOT_BELONG_TO_USER',
  DAILY_LIMIT_REACHED = 'DAILY_LIMIT_REACHED',
}

export enum AdminJoinDisputeChatError {
  DISPUTE_NOT_EXIST = 'DISPUTE_NOT_EXIST',
  DISPUTE_ALREADY_CLOSED = 'DISPUTE_ALREADY_CLOSED',
  JOINED_CHAT_ALREADY = 'JOINED_CHAT_ALREADY',
}

export enum AdminJoinRegularChatError {
  DISPUTE_NOT_EXIST = 'DISPUTE_NOT_EXIST',
  CONTRACT_NOT_EXIST = 'CONTRACT_NOT_EXIST',
  PROPOSAL_NOT_EXIST = 'PROPOSAL_NOT_EXIST',
  CHAT_NOT_EXIST = 'CHAT_NOT_EXIST',
  JOINED_CHAT_ALREADY = 'JOINED_CHAT_ALREADY',
}

export enum DisputeCloseError {
  DISPUTE_NOT_EXIST = 'DISPUTE_NOT_EXIST',
  DISPUTE_ALREADY_CLOSED = 'DISPUTE_ALREADY_CLOSED',
  RELEASE_AMT_GREATER_THAN_BUDGET = 'RELEASE_AMT_GREATER_THAN_BUDGET',
}

export type AdminDisputePagination = BasicPagination & AdminDisputeFilters

export interface DisputeFullAdminInfo {
  disputeAdminInfo: DisputeAdminInfo
  marketerInfo: UserStatePublicInfo
  influencerInfo: UserStatePublicInfo
  contractWithTask: ContractWithTask
}
