import { computed, reactive, readonly, ref } from 'vue'
import { ApiLoadingState, EntitiesLoadingState } from '@/types/api.model'
import { ProposalPublicInfo } from '@/types/proposal.model'
import { ContractWithTask } from '@/types/contract.model'

const marketerAddMilestonesState = reactive<EntitiesLoadingState>({
  state: 'loaded',
  payload: {
    message: undefined,
  },
})

const marketerProposal = ref<ProposalPublicInfo>()
const marketerTaskContract = ref<ContractWithTask>()
const isWaitingActionResponse = ref(false)

export default function useMarketerAddMilestonesStore() {
  const reset = () => {
    marketerAddMilestonesState.state = 'loaded'
    marketerAddMilestonesState.payload = { message: undefined }
    marketerProposal.value = undefined
    marketerTaskContract.value = undefined
    isWaitingActionResponse.value = false
  }

  const getActiveMarketerProposal = computed(() => marketerProposal.value)
  const setActiveMarketerProposal = (proposal?: ProposalPublicInfo) => (marketerProposal.value = proposal)

  const getActiveMarketerTaskContract = computed(() => marketerTaskContract.value)
  const setActiveMarketerTaskContract = (task?: ContractWithTask) => (marketerTaskContract.value = task)

  const getWaitingActionResponse = readonly(isWaitingActionResponse)
  const setWaitingActionResponse = (value: boolean) => (isWaitingActionResponse.value = value)

  const setCreateMarketerContractState = (state: ApiLoadingState, payload?: { message?: string }) => {
    marketerAddMilestonesState.state = state
    marketerAddMilestonesState.payload = payload
  }

  return {
    getActiveMarketerProposal,
    getWaitingActionResponse,
    getActiveMarketerTaskContract,
    marketerAddMilestonesState,
    reset,
    setActiveMarketerProposal,
    setActiveMarketerTaskContract,
    setCreateMarketerContractState,
    setWaitingActionResponse,
  }
}
