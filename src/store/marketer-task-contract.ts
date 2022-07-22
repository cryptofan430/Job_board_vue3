import { computed, reactive, ref } from 'vue'
import { ContractWithTask } from '@/types/contract.model'
import { ApiLoadingState, EntitiesLoadingState } from '@/types/api.model'
import { ProposalPublicInfo } from '@/types/proposal.model'

const marketerTaskContract = ref<ContractWithTask>()
const marketerContactState = reactive<EntitiesLoadingState>({
  state: 'loaded',
  payload: {
    message: undefined,
  },
})
const marketerTaskProposal = ref<ProposalPublicInfo>()
const proposalLoadingState = reactive<EntitiesLoadingState>({
  state: 'loading',
  payload: {
    message: undefined,
  },
})

const setMarketerTaskContract = (taskContract?: ContractWithTask) => {
  marketerTaskContract.value = taskContract
}

const setMarketerContractState = (state: ApiLoadingState, payload?: { message?: string }) => {
  marketerContactState.state = state
  marketerContactState.payload = payload
}

const setMarketerProposal = (proposal?: ProposalPublicInfo) => {
  marketerTaskProposal.value = proposal
}

const setMarketerProposalState = (state: ApiLoadingState, payload?: { message?: string }) => {
  proposalLoadingState.state = state
  proposalLoadingState.payload = payload
}

const reset = () => {
  marketerTaskContract.value = undefined
  marketerContactState.state = 'loaded'
  marketerContactState.payload = {
    message: undefined,
  }
  marketerTaskProposal.value = undefined
  proposalLoadingState.state = 'loaded'
  proposalLoadingState.payload = {
    message: undefined,
  }
}

export default function useMarketerTaskContractStore() {
  const getMarketerTaskContract = computed(() => marketerTaskContract.value)

  return {
    marketerContactState,
    getMarketerTaskContract,
    marketerTaskProposal,
    proposalLoadingState,
    setMarketerTaskContract,
    setMarketerContractState,
    setMarketerProposalState,
    setMarketerProposal,
    reset,
  }
}
