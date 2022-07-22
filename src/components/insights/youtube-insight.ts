import { useStringPathParamReactive } from '@/components/helpers/route'
import { extractEntitiesLoadingState } from '@/components/helpers/state'
import useSocialAccountController from '@/middleware/controllers/useSocialAccountController'
import useYoutubeInsightsStore from '@/store/youtube-insights'

export default function useYoutubeInsights() {
  const { fetchYoutubeInsight } = useSocialAccountController()
  const { fetchingYoutubeInsight, getYoutubeInsight, setInsightState, setYoutubeInsight } = useYoutubeInsightsStore()
  const youtubeId = useStringPathParamReactive('id')
  const { isLoaded, isLoading, isError } = extractEntitiesLoadingState(fetchingYoutubeInsight)

  const initYoutubeInsights = () => {
    if (youtubeId.value === null) return

    setInsightState('loading')

    fetchYoutubeInsight(youtubeId.value)
      .then((response) => {
        setYoutubeInsight(response.data)
        setInsightState('loaded')
      })
      .catch(() => {
        setInsightState('error')
      })
  }

  return {
    isLoaded,
    isLoading,
    isError,
    fetchingYoutubeInsight,
    getYoutubeInsight,
    initYoutubeInsights,
  }
}
