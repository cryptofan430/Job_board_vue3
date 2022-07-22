import { computed, reactive, ref } from 'vue'
import { ProposalPublicInfo } from '@/types/proposal.model'
import { ApiLoadingState, EntitiesLoadingState } from '@/types/api.model'
import { TaskPublicInfo } from '@/types/tasks.model'

export const influencerProposal = ref<ProposalPublicInfo>()
export const influencerProposalTask = ref<TaskPublicInfo>()
const influencerProposalState = reactive<EntitiesLoadingState>({
  state: 'loading',
  payload: {
    message: undefined,
  },
})

export const setInfluencerProposal = (proposal: ProposalPublicInfo) => (influencerProposal.value = proposal)
const setInfluencerProposalTask = (task?: TaskPublicInfo) => {
  influencerProposalTask.value = task
}
const setInfluencerProposalState = (state: ApiLoadingState, payload?: { message?: string }) => {
  influencerProposalState.state = state
  influencerProposalState.payload = payload
}

const reset = () => {
  influencerProposal.value = undefined
  influencerProposalTask.value = undefined
  influencerProposalState.state = 'loading'
  influencerProposalState.payload = { message: undefined }
}

export default function useInfluencerProposalStore() {
  const getInfluencerProposal = computed(() => influencerProposal.value)
  const getProposalTask = computed(() => influencerProposalTask.value)
  return {
    getInfluencerProposal,
    getProposalTask,
    influencerProposalState,
    setInfluencerProposal,
    setInfluencerProposalState,
    setInfluencerProposalTask,
    reset,
  }
}
