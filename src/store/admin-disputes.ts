import { computed, reactive, readonly, ref } from 'vue'
import { DisputeAdminInfo } from '@/types/disputes'
import { ApiLoadingState, EntitiesLoadingState } from '@/types/api.model'

const disputesCache = new Map<number, Array<DisputeAdminInfo>>()
const adminDisputes = ref<Array<DisputeAdminInfo>>([])
const adminDisputesCount = ref(0)
const adminDisputesState = reactive<EntitiesLoadingState>({
  state: 'loading',
  payload: {
    message: undefined,
  },
})

const getFirstDispute = () => adminDisputes.value[0]
const getLastDispute = () => adminDisputes.value[adminDisputes.value.length - 1]

const setAdminDisputes = (disputes: Array<DisputeAdminInfo>) => {
  adminDisputes.value = disputes
}

const setAdminDisputesCount = (count: number) => {
  adminDisputesCount.value = count
}

const setAdminDisputesState = (state: ApiLoadingState, payload?: { message?: string }) => {
  adminDisputesState.state = state
  adminDisputesState.payload = payload
}

const reset = () => {
  adminDisputes.value = []
  adminDisputesCount.value = 0
  adminDisputesState.state = 'loaded'
  adminDisputesState.payload = { message: undefined }
  disputesCache.clear()
}

export default function useAdminDisputesStore() {
  const getAdminDisputes = computed(() => adminDisputes.value)
  const getAdminDisputeCount = readonly(adminDisputesCount)

  return {
    getAdminDisputes,
    getAdminDisputeCount,
    adminDisputesState,
    disputesCache,
    getFirstDispute,
    getLastDispute,
    setAdminDisputes,
    setAdminDisputesCount,
    setAdminDisputesState,
    reset,
  }
}
