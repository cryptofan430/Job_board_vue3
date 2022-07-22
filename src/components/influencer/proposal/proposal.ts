import useInfluencerProposalStore from '@/store/influencer-proposal'
import useProposalController from '@/middleware/controllers/useProposalController'
import { useStringPathParamReactive } from '@/components/helpers/route'
import { extractEntitiesLoadingState } from '@/components/helpers/state'
import useTaskController from '@/middleware/controllers/useTaskController'
import useToastsStore from '@/store/toasts'
import router from '@/router'
import useUserStore from '@/store/user'
import useTaskStore from '@/store/task'

export default function useInfluencerProposal() {
  const taskId = useStringPathParamReactive('taskId')
  const { fetchMyProposalsForTask, deleteProposal } = useProposalController()
  const { fetchTask } = useTaskController()
  const { setSelectedTask } = useTaskStore()
  const { getMyId } = useUserStore()
  const { addToast } = useToastsStore()
  const {
    getInfluencerProposal,
    getProposalTask,
    influencerProposalState,
    setInfluencerProposal,
    setInfluencerProposalTask,
    setInfluencerProposalState,
    reset,
  } = useInfluencerProposalStore()
  const { isLoading, isLoaded, isError } = extractEntitiesLoadingState(influencerProposalState)

  const redirectToSubmitProposal = () => {
    return router.push({
      name: 'ProposalSubmit',
      params: { taskId: taskId.value },
    })
  }

  const initInfluencerProposal = async () => {
    setInfluencerProposalState('loading')

    if (getProposalTask.value?.id !== taskId.value) {
      setInfluencerProposalTask(undefined)
    }

    if (!getProposalTask.value) {
      try {
        const response = await fetchTask(taskId.value)

        const task = response.data
        setInfluencerProposalTask(task)
        if (task.addedByMe) {
          setSelectedTask(task)
          return router.push({
            name: 'MarketerTaskDetails',
            params: { taskId: task.id },
          })
        }
      } catch (e) {
        setInfluencerProposalState('error')
      }
    }

    fetchMyProposalsForTask(taskId.value)
      .then((response) => {
        // is it possible for influencer to have more than one proposal for a single task?
        const influencerProposal = response.data.proposals[0]
        if (!influencerProposal) return redirectToSubmitProposal()
        if (influencerProposal.userId !== getMyId.value) return redirectToSubmitProposal()

        if (influencerProposal.contractId) {
          // add here contract management setter when that store is implemented
          return router.push({
            name: 'ContractManagement',
            params: {
              taskId: taskId.value,
              contractId: influencerProposal.contractId,
            },
          })
        }

        setInfluencerProposal(influencerProposal)
        setInfluencerProposalState('loaded')
      })
      .catch(() => setInfluencerProposalState('error'))
  }

  const withdrawProposal = () => {
    if (!getInfluencerProposal.value) return
    const proposalId = getInfluencerProposal.value.id

    deleteProposal(proposalId)
      .then(() => {
        addToast('Proposal has been successfully withdrawn', 'success')
        router.push({ name: 'Tasks' })
      })
      .catch(() => addToast('An error occurred during deleting proposal', 'danger'))
  }

  const resetState = () => {
    reset()
  }

  return {
    isLoading,
    isLoaded,
    isError,
    getInfluencerProposal,
    getProposalTask,
    initInfluencerProposal,
    withdrawProposal,
    resetState,
  }
}
