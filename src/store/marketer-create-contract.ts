import { computed, reactive, readonly, ref } from 'vue'
import { ApiLoadingState, EntitiesLoadingState } from '@/types/api.model'
import { ProposalPublicInfo } from '@/types/proposal.model'
import { TaskPublicInfo } from '@/types/tasks.model'

const marketerCreateContractState = reactive<EntitiesLoadingState>({
  state: 'loaded',
  payload: {
    message: undefined,
  },
})

const marketerProposal = ref<ProposalPublicInfo>()
const marketerTask = ref<TaskPublicInfo>()
const isWaitingActionResponse = ref(false)

export default function useMarketerCreateContractStore() {
  const reset = () => {
    marketerCreateContractState.state = 'loaded'
    marketerCreateContractState.payload = { message: undefined }
    marketerProposal.value = undefined
    marketerTask.value = undefined
    isWaitingActionResponse.value = false
  }

  const getActiveMarketerProposal = computed(() => marketerProposal.value)
  const setActiveMarketerProposal = (proposal?: ProposalPublicInfo) => (marketerProposal.value = proposal)

  const getActiveMarketerTask = computed(() => marketerTask.value)
  const setActiveMarketerTask = (task?: TaskPublicInfo) => (marketerTask.value = task)

  const getWaitingActionResponse = readonly(isWaitingActionResponse)
  const setWaitingActionResponse = (value: boolean) => (isWaitingActionResponse.value = value)

  const setCreateMarketerContractState = (state: ApiLoadingState, payload?: { message?: string }) => {
    marketerCreateContractState.state = state
    marketerCreateContractState.payload = payload
  }

  return {
    getActiveMarketerProposal,
    getWaitingActionResponse,
    getActiveMarketerTask,
    marketerCreateContractState,
    reset,
    setActiveMarketerProposal,
    setActiveMarketerTask,
    setCreateMarketerContractState,
    setWaitingActionResponse,
  }
}
