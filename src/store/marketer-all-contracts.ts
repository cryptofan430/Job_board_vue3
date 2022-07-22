import { computed, reactive, readonly, Ref, ref } from 'vue'
import { ApiLoadingState, EntitiesLoadingState } from '@/types/api.model'
import { ContractWithTask } from '@/types/contract.model'

const marketerContracts = ref<Array<ContractWithTask>>([])
const marketerContractsCount: Ref<number> = ref(0)
const marketerContactsState = reactive<EntitiesLoadingState>({
  state: 'loading',
  payload: {
    message: undefined,
  },
})
const contractsCache = new Map<number, ContractWithTask[]>()

export default function useMarketerContractsStore() {
  const getMarketerContracts = computed(() => marketerContracts.value)
  const getMarketerContractsCount = readonly(marketerContractsCount)
  const getMarketerContractsState = computed(() => marketerContactsState)

  const setMarketerContracts = (Contracts: Array<ContractWithTask>) => {
    marketerContracts.value = Contracts
  }
  const getFirstMarketerContract = () => marketerContracts.value[0] || null
  const getLastMarketerContract = () => marketerContracts.value[marketerContracts.value.length - 1] || null
  const setMarketerContractsCount = (ContractsCount: number) => (marketerContractsCount.value = ContractsCount)

  const setMarketerContractsState = (state: ApiLoadingState, payload?: { message?: string }) => {
    marketerContactsState.state = state
    marketerContactsState.payload = payload
  }

  const reset = () => {
    marketerContractsCount.value = 0
    marketerContracts.value = []
    marketerContactsState.state = 'loading'
    marketerContactsState.payload = { message: undefined }
    contractsCache.clear()
  }

  return {
    getMarketerContracts,
    getMarketerContractsCount,
    getMarketerContractsState,
    contractsCache,
    reset,
    setMarketerContracts,
    getFirstMarketerContract,
    getLastMarketerContract,
    setMarketerContractsCount,
    setMarketerContractsState,
  }
}
