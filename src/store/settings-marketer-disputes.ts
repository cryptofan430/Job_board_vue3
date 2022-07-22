import { computed, reactive, readonly, ref } from 'vue'
import { DisputePublicInfo } from '@/types/disputes'
import { ApiLoadingState, EntitiesLoadingState } from '@/types/api.model'

const marketerDisputesCache = new Map<number, Array<DisputePublicInfo>>()
const marketerDisputes = ref<Array<DisputePublicInfo>>()
const marketerDisputesCount = ref<number>()
const marketerDisputesState = reactive<EntitiesLoadingState>({
  state: 'loaded',
  payload: {
    message: undefined,
  },
})

const setDisputes = (disputes: Array<DisputePublicInfo>) => {
  marketerDisputes.value = disputes
}

const setDisputesCount = (count: number) => {
  marketerDisputesCount.value = count
}

const setSettingsDisputesState = (state: ApiLoadingState, payload?: { message?: string }) => {
  marketerDisputesState.state = state
  marketerDisputesState.payload = payload
}

const reset = () => {
  marketerDisputes.value = []
  marketerDisputesCount.value = 0
  marketerDisputesState.state = 'loaded'
  marketerDisputesState.payload = { message: undefined }
  marketerDisputesCache.clear()
}

export default function useMarketerDisputesStore() {
  const getMarketerDisputes = computed(() => marketerDisputes.value)
  const getMarketerDisputesCount = readonly(marketerDisputesCount)

  return {
    marketerDisputesCache,
    getMarketerDisputes,
    getMarketerDisputesCount,
    marketerDisputesState,
    setDisputes,
    setDisputesCount,
    setSettingsDisputesState,
    reset,
  }
}
