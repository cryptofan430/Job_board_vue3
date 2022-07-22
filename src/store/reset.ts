import useAuthStore from './auth'
import useTaskStore from './task'
import useTasksStore from './my-tasks'
import useUserStore from './user'
import useTagsStore from './tags'
import useNotificationStore from './notifications'
import useMarketerTasksStore from '@/store/marketer-tasks'
import useMarketerTaskContractsStore from '@/store/marketer-task-contracts'
import useMarketerAllContractsStore from '@/store/marketer-all-contracts'
import useInfluencerProposalsStore from '@/store/influencer-proposals'
import useInfluencerContractsStore from '@/store/influencer-contracts'
import useInfluencerInvitationsStore from './influencer-invitations'
import useAllTasksStore from '@/store/all-tasks'
import useInfluencerProposalStore from '@/store/influencer-proposal'
import useChatStore from '@/store/chat'
import useContractAcceptStore from '@/store/contract-accept'
import useInfluencerContractManagementStore from '@/store/influencer-contract-management'
import useMarketerAddMilestones from '@/store/marketer-add-milestones'
import useMarketerTaskContract from '@/store/marketer-task-contract'
import useTransactionsHistoryStore from './settings-transactions-history'
import useTaskInvitationsStore from '@/store/task-invitations-store'
import useInfluencerDisputesStore from '@/store/settings-influencer-disputes'
import useMarketerDisputesStore from './settings-marketer-disputes'
import useSettingsTicketsStore from './settings-tickets'
import useAdminTicketsStore from './admin-tickets'
import useAnnouncementStore from './announcements'
import useInstagramInsightsStore from '@/store/instagram-insights'

interface Resetable {
  reset: () => void
}

export default function useResetStore() {
  const resetableStores: Array<Resetable> = [
    useAuthStore(),
    useUserStore(),
    useTaskStore(),
    useTasksStore(),
    useTagsStore(),
    useNotificationStore(),
    useMarketerTasksStore(),
    useMarketerTaskContractsStore(),
    useMarketerTaskContract(),
    useInfluencerContractManagementStore(),
    useMarketerAddMilestones(),
    useTaskInvitationsStore(),
    useMarketerAllContractsStore(),
    useInfluencerProposalStore(),
    useInfluencerProposalsStore(),
    useInfluencerInvitationsStore(),
    useContractAcceptStore(),
    useInfluencerContractManagementStore(),
    useInfluencerContractsStore(),
    useAllTasksStore(),
    useChatStore(),
    useTransactionsHistoryStore(),
    useInfluencerDisputesStore(),
    useMarketerDisputesStore(),
    useSettingsTicketsStore(),
    useAdminTicketsStore(),
    useInstagramInsightsStore(),
    useAnnouncementStore(),
  ]

  const reset = () => resetableStores.forEach((store) => store.reset())

  return { reset }
}
