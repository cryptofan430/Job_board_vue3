import { computed, reactive, readonly, ref } from 'vue'
import { DisputePublicInfo } from '@/types/disputes'
import { ApiLoadingState, EntitiesLoadingState } from '@/types/api.model'

const influencerDisputesCache = new Map<number, Array<DisputePublicInfo>>()
const influencerDisputes = ref<Array<DisputePublicInfo>>()
const influencerDisputesCount = ref<number>()
const influencerDisputesState = reactive<EntitiesLoadingState>({
  state: 'loaded',
  payload: {
    message: undefined,
  },
})

const setDisputes = (disputes: Array<DisputePublicInfo>) => {
  influencerDisputes.value = disputes
}

const setDisputesCount = (count: number) => {
  influencerDisputesCount.value = count
}

const setSettingsDisputesState = (state: ApiLoadingState, payload?: { message?: string }) => {
  influencerDisputesState.state = state
  influencerDisputesState.payload = payload
}

const reset = () => {
  influencerDisputes.value = []
  influencerDisputesCount.value = 0
  influencerDisputesState.state = 'loaded'
  influencerDisputesState.payload = { message: undefined }
  influencerDisputesCache.clear()
}

export default function useInfluencerDisputesStore() {
  const getInfluencerDisputes = computed(() => influencerDisputes.value)
  const getInfluencerDisputesCount = readonly(influencerDisputesCount)

  return {
    influencerDisputesCache,
    getInfluencerDisputes,
    getInfluencerDisputesCount,
    influencerDisputesState,
    setDisputes,
    setDisputesCount,
    setSettingsDisputesState,
    reset,
  }
}
