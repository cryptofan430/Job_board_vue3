import { ref, computed, reactive } from 'vue'
import { DisputeFullAdminInfo } from '@/types/disputes'
import { ApiLoadingState, EntitiesLoadingState } from '@/types/api.model'

export const adminDispute = ref<DisputeFullAdminInfo | null>(null)
const adminDisputeState = reactive<EntitiesLoadingState>({
  state: 'loaded',
  payload: {
    message: undefined,
  },
})

const setAdminDispute = (dispute?: DisputeFullAdminInfo) => {
  adminDispute.value = dispute || null
}

const setAdminDisputesState = (state: ApiLoadingState, payload?: { message?: string }) => {
  adminDisputeState.state = state
  adminDisputeState.payload = payload
}

export default function useAdminDisputeStore() {
  const getAdminDispute = computed(() => adminDispute.value)

  return {
    getAdminDispute,
    adminDisputeState,
    setAdminDispute,
    setAdminDisputesState,
  }
}
