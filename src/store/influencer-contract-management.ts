import { computed, reactive, ref } from 'vue'
import { ContractWithTask } from '@/types/contract.model'
import { ApiLoadingState, EntitiesLoadingState } from '@/types/api.model'

const taskContract = ref<ContractWithTask>()
const taskContactState = reactive<EntitiesLoadingState>({
  state: 'loaded',
  payload: {
    message: undefined,
  },
})

const setTaskContract = (newTaskContract?: ContractWithTask) => {
  taskContract.value = newTaskContract
}
const setTaskContractsState = (state: ApiLoadingState, payload?: { message?: string }) => {
  taskContactState.state = state
  taskContactState.payload = payload
}

const reset = () => {
  taskContract.value = undefined
  taskContactState.state = 'loaded'
  taskContactState.payload = { message: undefined }
}

export default function useInfluencerContractManagementStore() {
  const getTaskContract = computed(() => taskContract.value)

  return {
    getTaskContract,
    taskContactState,
    reset,
    setTaskContract,
    setTaskContractsState,
  }
}
