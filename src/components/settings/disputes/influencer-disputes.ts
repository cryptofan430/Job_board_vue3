import { computed } from 'vue'
import { PaginationWithPage } from '@/types/api.model'
import { clearPaginationPayload, fetchEntitiesFactory } from '@/components/helpers/api'
import { extractEntitiesLoadingState } from '@/components/helpers/state'
import useDisputesController from '@/middleware/controllers/useDisputesController'
import useInfluencerDisputesStore from '@/store/settings-influencer-disputes'
import useInfluencerDisputesParams from './influencer-disputes-params'

export default function useInfluencerDisputes() {
  const { getInfluencerDisputes: fetchInfluencerDisputes } = useDisputesController()
  const {
    getInfluencerDisputes,
    getInfluencerDisputesCount,
    influencerDisputesState,
    influencerDisputesCache,
    setDisputes,
    setDisputesCount,
    setSettingsDisputesState,
  } = useInfluencerDisputesStore()
  const { disputesPagination, paginationPayload, disputesPerPage } = useInfluencerDisputesParams()

  const activePage = computed(() => disputesPagination.skip / disputesPagination.limit + 1)
  const { isLoaded, isLoading, isError } = extractEntitiesLoadingState(influencerDisputesState)

  const _fetchDisputes = async (params: PaginationWithPage & { state: string }) => {
    const {
      updatedParams,
      currentPageEntities: cachedEntities,
      extractCurrentEntities,
      calcEntitiesCount,
    } = fetchEntitiesFactory(params, influencerDisputesCache)

    if (cachedEntities) {
      setDisputes(cachedEntities)
    }

    if (extractCurrentEntities) {
      return await fetchInfluencerDisputes(updatedParams).then((response) => {
        const { currentPageEntities } = extractCurrentEntities(response.data.disputes)

        if (calcEntitiesCount) setDisputesCount(calcEntitiesCount(response.data.count))
        if (!cachedEntities) setDisputes(currentPageEntities)
      })
    }
  }

  const fetchDisputesInitial = () => {
    _fetchDisputes({
      ...disputesPagination,
      ...paginationPayload,
      limit: 2 ** 28,
      state: 'INFLUENCER',
      targetPage: activePage.value,
    })
      .then(() => setSettingsDisputesState('loaded'))
      .catch((e) => setSettingsDisputesState('error', { message: e?.message }))

    clearPaginationPayload(paginationPayload)
  }

  const refetchDisputes = () => {
    setSettingsDisputesState('loading')
    fetchDisputesInitial()
  }

  return {
    isLoaded,
    isLoading,
    isError,
    getInfluencerDisputes,
    getInfluencerDisputesCount,
    disputesPerPage,

    refetchDisputes,
  }
}
