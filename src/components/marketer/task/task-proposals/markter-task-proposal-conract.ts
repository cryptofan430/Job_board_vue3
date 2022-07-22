import useMarketerCreateContractStore from '@/store/marketer-create-contract'
import { ProposalPublicInfo } from '@/types/proposal.model'
import { TaskPublicInfo } from '@/types/tasks.model'
import { useRouter } from 'vue-router'

export default function useMarketerTaskProposalContract() {
  const { setActiveMarketerProposal, setActiveMarketerTask } = useMarketerCreateContractStore()
  const router = useRouter()

  const goToProposal = (proposal: ProposalPublicInfo, taskId: string, task?: TaskPublicInfo) => {
    setActiveMarketerProposal(proposal)
    if (task) setActiveMarketerTask(task)
    router.push(`/m/tasks/${taskId}/proposals/${proposal.id}/create-contract`)
  }

  return { goToProposal }
}
