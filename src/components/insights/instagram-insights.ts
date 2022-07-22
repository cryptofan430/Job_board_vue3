import { useStringPathParamReactive } from '@/components/helpers/route'
import { extractEntitiesLoadingState } from '@/components/helpers/state'
import useSocialAccountController from '@/middleware/controllers/useSocialAccountController'
import useInstagramInsightsStore from '@/store/instagram-insights'

export default function useInstagramInsights() {
  const { fetchInstagramInsight } = useSocialAccountController()
  const { fetchingInstagramInsight, getInstagramInsight, setInsightState, setInstagramInsight } =
    useInstagramInsightsStore()
  const instagramId = useStringPathParamReactive('id')
  const { isLoaded, isLoading, isError } = extractEntitiesLoadingState(fetchingInstagramInsight)

  const initInstagramInsights = () => {
    if (instagramId.value === null) return

    setInsightState('loading')

    fetchInstagramInsight(instagramId.value)
      .then((response) => {
        setInstagramInsight(response.data)
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
    fetchingInstagramInsight,
    getInstagramInsight,
    initInstagramInsights,
  }
}
