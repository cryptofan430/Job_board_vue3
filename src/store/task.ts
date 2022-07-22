import { computed, reactive, ref } from 'vue'
import { ProposalPublicInfo } from '@/types/proposal.model'
import { TaskPublicInfo } from '@/types/tasks.model'
import { ApiLoadingState, EntitiesLoadingState } from '@/types/api.model'

const selectedTask = ref<TaskPublicInfo | null>(null)
const selectedTaskProposals = ref<Array<ProposalPublicInfo>>([])
const selectedTaskProposalsState = reactive<EntitiesLoadingState>({
  state: 'loading',
  payload: {
    message: undefined,
  },
})
const marketerTaskProposalsCache = new Map<number, ProposalPublicInfo[]>()

export default function useTaskStore() {
  const setSelectedTask = (task: TaskPublicInfo | null) => {
    selectedTask.value = task
  }
  const getSelectedTask = computed(() => selectedTask.value)
  const updateSelectedTask = (proposalCount: number, proposalAlereadySent: boolean) => {
    if (!selectedTask.value) return

    selectedTask.value.proposalCount += proposalCount
    selectedTask.value.proposalAlreadySent = proposalAlereadySent
  }

  const getProposalsForSelectedTask = computed(() => selectedTaskProposals.value)
  const setProposalsForSelectedTask = (proposals: Array<ProposalPublicInfo>) => {
    selectedTaskProposals.value = proposals
  }

  const getProposalsStateForSelectedTask = computed(() => selectedTaskProposalsState)

  const getSelectedTaskFirstProposal = () => selectedTaskProposals.value[0] || null
  const getSelectedTaskLastProposal = () => selectedTaskProposals.value[selectedTaskProposals.value.length - 1] || null
  const setSelectedTaskProposals = (proposals: Array<ProposalPublicInfo>) => {
    selectedTaskProposals.value = proposals
  }

  const setSelectedTaskProposalsState = (state: ApiLoadingState, payload?: { message?: string }) => {
    selectedTaskProposalsState.state = state
    selectedTaskProposalsState.payload = payload
  }

  const resetProposals = () => {
    selectedTaskProposals.value = []
    selectedTaskProposalsState.state = 'loading'
    selectedTaskProposalsState.payload = {}
    marketerTaskProposalsCache.clear()
  }

  const reset = () => {
    resetProposals()
  }

  return {
    getSelectedTask,
    getProposalsForSelectedTask,
    getProposalsStateForSelectedTask,
    marketerTaskProposalsCache,
    getSelectedTaskFirstProposal,
    getSelectedTaskLastProposal,
    setSelectedTaskProposals,
    setSelectedTaskProposalsState,
    setSelectedTask,
    updateSelectedTask,
    setProposalsForSelectedTask,
    reset,
  }
}
