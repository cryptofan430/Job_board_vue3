import { computed, reactive, ref } from 'vue'
import { InstagramInsightGrouped } from '@/types/social-account.model'
import { ApiLoadingState, EntitiesLoadingState } from '@/types/api.model'

export const currentInstagramInsight = ref<InstagramInsightGrouped | null>(null)
export const fetchingInstagramInsight = reactive<EntitiesLoadingState>({
  state: 'loading',
  payload: {
    message: undefined,
  },
})

const setInstagramInsight = (instagramInsight?: InstagramInsightGrouped | null) => {
  currentInstagramInsight.value = instagramInsight || null
}

const setInsightState = (state: ApiLoadingState, payload?: { message?: string }) => {
  fetchingInstagramInsight.state = state
  fetchingInstagramInsight.payload = payload
}

const reset = () => {
  currentInstagramInsight.value = null
  fetchingInstagramInsight.state = 'loading'
  fetchingInstagramInsight.payload = { message: undefined }
}

export default function useInstagramInsightsStore() {
  const getInstagramInsight = computed(() => currentInstagramInsight.value)

  return {
    getInstagramInsight,
    fetchingInstagramInsight,
    setInstagramInsight,
    setInsightState,
    reset,
  }
}
