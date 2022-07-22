import { computed, reactive, readonly, Ref, ref } from 'vue'
import { ApiLoadingState, EntitiesLoadingState } from '@/types/api.model'
import { ProposalWithTask } from '@/types/proposal.model'

const influencerProposals = ref<Array<ProposalWithTask>>([])
const influencerProposalsCount: Ref<number> = ref(0)
const influencerProposalsState = reactive<EntitiesLoadingState>({
  state: 'loading',
  payload: {
    message: undefined,
  },
})
const influencerProposalsCache = new Map<number, ProposalWithTask[]>()

export default function useInfluencerProposalsStore() {
  const getInfluencerProposals = computed(() => influencerProposals.value)
  const getInfluencerProposalsCount = readonly(influencerProposalsCount)
  const getInfluencerProposalsState = computed(() => influencerProposalsState)

  const setInfluencerProposals = (proposals: Array<ProposalWithTask>) => {
    influencerProposals.value = proposals
  }
  const getFirstInfluencerProposal = () => influencerProposals.value[0] || null
  const getLastInfluencerProposal = () => influencerProposals.value[influencerProposals.value.length - 1] || null
  const setInfluencerProposalsCount = (proposalsCount: number) => (influencerProposalsCount.value = proposalsCount)

  const setInfluencerProposalsState = (state: ApiLoadingState, payload?: { message?: string }) => {
    influencerProposalsState.state = state
    influencerProposalsState.payload = payload
  }

  const reset = () => {
    influencerProposalsCount.value = 0
    influencerProposals.value = []
    influencerProposalsState.state = 'loading'
    influencerProposalsState.payload = { message: undefined }
    influencerProposalsCache.clear()
  }

  return {
    getInfluencerProposals,
    getInfluencerProposalsCount,
    getInfluencerProposalsState,
    influencerProposalsCache,
    reset,
    setInfluencerProposals,
    getFirstInfluencerProposal,
    getLastInfluencerProposal,
    setInfluencerProposalsCount,
    setInfluencerProposalsState,
  }
}
