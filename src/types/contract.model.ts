import { TaskPublicInfo } from '@/types/tasks.model'
import { DisputeState } from './disputes'
import { SimpleAccessFile } from './file.model'
import { CurrencyValue } from './money.model'
import { UserStatePublicInfo } from './user.model'

export interface ContractsMyAllResponse {
  contractTaskPairs: Array<ContractWithTask>
  count: number
}

export interface ContractWithTask {
  task: TaskPublicInfo
  contract: ContractPublicInfo
  userStateInfo: UserStatePublicInfo
  chatId: string
  proposalId: string
}

export interface ContractPublicInfo {
  id: string
  taskId: string
  taskCreatorId: string
  proposingUserId: string
  milestones: Array<ContractMilestonePublicInfo>
  accepted: boolean
  ended: boolean
  marketerReviewed: boolean
  influencerReviewed: boolean
}

export interface ContractMilestonePublicInfo {
  id: string
  title: string
  budget: CurrencyValue
  description: string
  disputeId: string | null
  disputeChatId: string | null
  state: MilestoneState
  invoice: SimpleAccessFile | null
  serviceFeeInvoice: SimpleAccessFile | null
  disputeState: DisputeState
}

export enum MilestoneState {
  NOT_SECURED = 'NOT_SECURED',
  SECURED = 'SECURED',
  RELEASED = 'RELEASED',
}

export interface ContractToCreate {
  proposalId: string
  milestones: Array<ContractMilestoneToAdd>
}

export interface ContractMilestoneToAdd {
  budget: number
  description: string
}

export interface ContractMilestoneToAddRequest {
  milestones: Array<ContractMilestoneToAdd>
}

export interface ContractsResponse {
  contracts: Array<ContractWithUserStateInfo>
  count: number
}

export interface ContractWithUserStateInfo {
  contract: ContractPublicInfo
  userStateInfo: UserStatePublicInfo
  chatId: string
  proposalId: string
}

export enum MilestoneDeleteError {
  CONTRACT_NOT_EXIST = 'CONTRACT_NOT_EXIST',
  UNABLE_TO_MODIFY_ENDED_CONTRACT = 'UNABLE_TO_MODIFY_ENDED_CONTRACT',
  CONTRACT_NOT_BELONG_TO_USER = 'CONTRACT_NOT_BELONG_TO_USER',
  MILESTONE_NOT_EXIST = 'MILESTONE_NOT_EXIST',
  UNABLE_TO_RELEASE_MILESTONE = 'UNABLE_TO_RELEASE_MILESTONE',
}

export enum MilestoneReleaseError {
  CONTRACT_NOT_EXIST = 'CONTRACT_NOT_EXIST',
  UNABLE_TO_MODIFY_ENDED_CONTRACT = 'UNABLE_TO_MODIFY_ENDED_CONTRACT',
  CONTRACT_NOT_BELONG_TO_USER = 'CONTRACT_NOT_BELONG_TO_USER',
  MILESTONE_NOT_EXIST = 'MILESTONE_NOT_EXIST',
  UNABLE_TO_RELEASE_MILESTONE = 'UNABLE_TO_RELEASE_MILESTONE',
}

export enum MilestoneSecureError {
  CONTRACT_NOT_EXIST = 'CONTRACT_NOT_EXIST',
  UNABLE_TO_MODIFY_ENDED_CONTRACT = 'UNABLE_TO_MODIFY_ENDED_CONTRACT',
  UNABLE_TO_SECURE_MONEY_IN_NOT_ACCEPTED_CONTRACT = 'UNABLE_TO_SECURE_MONEY_IN_NOT_ACCEPTED_CONTRACT',
  UNABLE_TO_SECURE_NOT_NOT_SECURED_MILESTONE = 'UNABLE_TO_SECURE_NOT_NOT_SECURED_MILESTONE',
  NOT_ENOUGH_MONEY = 'NOT_ENOUGH_MONEY',
  CONTRACT_NOT_BELONG_TO_USER = 'CONTRACT_NOT_BELONG_TO_USER',
  MILESTONE_NOT_EXIST = 'MILESTONE_NOT_EXIST',
  UNABLE_TO_RELEASE_MILESTONE = 'UNABLE_TO_RELEASE_MILESTONE',
}

export enum ContractEndErrors {
  CONTRACT_NOT_EXIST = 'CONTRACT_NOT_EXIST',
  CONTRACT_NOT_BELONG_TO_USER = 'CONTRACT_NOT_BELONG_TO_USER',
  UNABLE_TO_END_NOT_ACCEPTED_CONTRACT = 'UNABLE_TO_END_NOT_ACCEPTED_CONTRACT',
  UNABLE_TO_END_CONTRACT_WITH_SECURED_MILESTONES = 'UNABLE_TO_END_CONTRACT_WITH_SECURED_MILESTONES',
}

export enum AddMilestonesErrors {
  CONTRACT_NOT_EXIST = 'CONTRACT_NOT_EXIST',
  UNABLE_TO_MODIFY_ENDED_CONTRACT = 'UNABLE_TO_MODIFY_ENDED_CONTRACT',
  CONTRACT_NOT_BELONG_TO_USER = 'CONTRACT_NOT_BELONG_TO_USER',
}
