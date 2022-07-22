import { computed, reactive, ref } from 'vue'
import { YoutubeMetricsGrouped } from '@/types/social-account.model'
import { ApiLoadingState, EntitiesLoadingState } from '@/types/api.model'

export const currentYoutubeInsight = ref<YoutubeMetricsGrouped | null>(null)
export const fetchingYoutubeInsight = reactive<EntitiesLoadingState>({
  state: 'loading',
  payload: {
    message: undefined,
  },
})

const setYoutubeInsight = (youtubeInsight?: YoutubeMetricsGrouped | null) => {
  currentYoutubeInsight.value = youtubeInsight || null
}

const setInsightState = (state: ApiLoadingState, payload?: { message?: string }) => {
  fetchingYoutubeInsight.state = state
  fetchingYoutubeInsight.payload = payload
}

const reset = () => {
  currentYoutubeInsight.value = null
  fetchingYoutubeInsight.state = 'loading'
  fetchingYoutubeInsight.payload = { message: undefined }
}

export default function useYoutubeInsightsStore() {
  const getYoutubeInsight = computed(() => currentYoutubeInsight.value)

  return {
    getYoutubeInsight,
    fetchingYoutubeInsight,
    setYoutubeInsight,
    setInsightState,
    reset,
  }
}
