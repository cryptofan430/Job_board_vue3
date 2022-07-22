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
const isAcceptingContract = ref(false)
const isDecliningContract = ref(false)

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
  isAcceptingContract.value = false
  isDecliningContract.value = false
}

const setAcceptingContract = (value: boolean) => {
  isAcceptingContract.value = value
}

const setDecliningContract = (value: boolean) => {
  isDecliningContract.value = value
}

export default function useContractAcceptStore() {
  const getTaskContract = computed(() => taskContract.value)
  const isWaitingActionResponse = computed(() => isAcceptingContract.value || isDecliningContract.value)

  return {
    isWaitingActionResponse,
    isAcceptingContract,
    isDecliningContract,
    getTaskContract,
    taskContactState,
    reset,
    setTaskContract,
    setTaskContractsState,
    setAcceptingContract,
    setDecliningContract,
  }
}
