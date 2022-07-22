import { TaskPublicInfo } from '@/types/tasks.model'
import { CurrencyValue } from './money.model'
import { AccountIdsGroupedByPlatform, SocialAccountsForProposal } from './platform.model'
import { UserStatePublicInfo } from './user.model'

export interface ProposalUpdateData {
  id: string
  cost?: number
  description?: string
  accountsIdsGroupedByPlatform?: AccountIdsGroupedByPlatform
}

export interface ProposalToAdd {
  taskId: string
  cost: number
  description: string
  accountsIdsGroupedByPlatform: AccountIdsGroupedByPlatform
}

export interface ProposalPublicInfo {
  id: string
  cost: CurrencyValue
  description: string
  addedTime: string
  userId: string
  accounts: SocialAccountsForProposal
  contractId: string | null
  chatId: string | null
  influencerInfo: UserStatePublicInfo
}

export interface ProposalsMyAllResponse {
  proposalTaskPairs: Array<ProposalWithTask>
  count: number
}

export interface ProposalWithTask {
  task: TaskPublicInfo
  proposal: ProposalPublicInfo
}

export interface ProposalsResponse {
  proposals: Array<ProposalPublicInfo>
  count: number
}
