import { computed } from 'vue'
import { PaginationWithPage } from '@/types/api.model'
import { clearPaginationPayload, fetchEntitiesFactory } from '@/components/helpers/api'
import { extractEntitiesLoadingState } from '@/components/helpers/state'
import useDisputesController from '@/middleware/controllers/useDisputesController'
import useMarketerDisputesStore from '@/store/settings-marketer-disputes'
import useMarketerDisputesParams from './marketer-disputes-params'

export default function useMarketerDisputes() {
  const { getMarketerDisputes: fetchMarketerDisputes } = useDisputesController()
  const {
    getMarketerDisputes,
    getMarketerDisputesCount,
    marketerDisputesState,
    marketerDisputesCache,
    setDisputes,
    setDisputesCount,
    setSettingsDisputesState,
  } = useMarketerDisputesStore()
  const { disputesPagination, paginationPayload, disputesPerPage } = useMarketerDisputesParams()

  const activePage = computed(() => disputesPagination.skip / disputesPagination.limit + 1)
  const { isLoaded, isLoading, isError } = extractEntitiesLoadingState(marketerDisputesState)

  const _fetchDisputes = async (params: PaginationWithPage & { state: string }) => {
    const {
      updatedParams,
      currentPageEntities: cachedEntities,
      extractCurrentEntities,
      calcEntitiesCount,
    } = fetchEntitiesFactory(params, marketerDisputesCache)

    if (cachedEntities) {
      setDisputes(cachedEntities)
    }

    if (extractCurrentEntities) {
      return await fetchMarketerDisputes(updatedParams).then((response) => {
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
      state: 'MARKETER',
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
    getMarketerDisputes,
    getMarketerDisputesCount,
    disputesPerPage,

    refetchDisputes,
  }
}
