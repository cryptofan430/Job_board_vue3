import { computed, reactive, readonly, Ref, ref } from 'vue'
import { ApiLoadingState, EntitiesLoadingState } from '@/types/api.model'
import { ContractWithTask } from '@/types/contract.model'

const influencerContracts = ref<Array<ContractWithTask>>([])
const influencerContractsCount: Ref<number> = ref(0)
const influencerContactsState = reactive<EntitiesLoadingState>({
  state: 'loading',
  payload: {
    message: undefined,
  },
})
const contractsCache = new Map<number, ContractWithTask[]>()

export default function useInfluencerContractsStore() {
  const getInfluencerContracts = computed(() => influencerContracts.value)
  const getInfluencerContractsCount = readonly(influencerContractsCount)
  const getInfluencerContractsState = computed(() => influencerContactsState)

  const setInfluencerContracts = (Contracts: Array<ContractWithTask>) => {
    influencerContracts.value = Contracts
  }
  const getFirstInfluencerContract = () => influencerContracts.value[0] || null
  const getLastInfluencerContract = () => influencerContracts.value[influencerContracts.value.length - 1] || null
  const setInfluencerContractsCount = (ContractsCount: number) => (influencerContractsCount.value = ContractsCount)

  const setInfluencerContractsState = (state: ApiLoadingState, payload?: { message?: string }) => {
    influencerContactsState.state = state
    influencerContactsState.payload = payload
  }

  const reset = () => {
    influencerContractsCount.value = 0
    influencerContracts.value = []
    influencerContactsState.state = 'loading'
    influencerContactsState.payload = { message: undefined }
    contractsCache.clear()
  }

  return {
    contractsCache,
    getInfluencerContracts,
    getInfluencerContractsCount,
    getInfluencerContractsState,
    reset,
    setInfluencerContracts,
    getFirstInfluencerContract,
    getLastInfluencerContract,
    setInfluencerContractsCount,
    setInfluencerContractsState,
  }
}
