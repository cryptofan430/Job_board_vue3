import { clearPaginationPayload, createPageLimitsWatcher, fetchEntitiesFactory } from '@/components/helpers/api'
import { PaginationWithPage } from '@/types/api.model'
import useContractController from '@/middleware/controllers/useContractController'
import useInfluencerContractsStore from '@/store/influencer-contracts'
import useInfluencerContractsFilters from './contracts-params'
import { computed, watch } from 'vue'

export default function useInfluencerContracts() {
  const { fetchInfluencerContracts } = useContractController()
  const {
    contractsCache,
    getInfluencerContracts,
    getInfluencerContractsCount,
    getInfluencerContractsState,
    getFirstInfluencerContract,
    getLastInfluencerContract,
    setInfluencerContracts,
    setInfluencerContractsCount,
    setInfluencerContractsState,
  } = useInfluencerContractsStore()

  const { influencerContractsPagination, paginationPayload, influencerContractsPerPage, updateRouteParams } =
    useInfluencerContractsFilters()

  const activePage = computed(() => influencerContractsPagination.skip / influencerContractsPagination.limit + 1)
  const isLoading = computed(() => getInfluencerContractsState.value.state === 'loading')
  const isLoaded = computed(() => getInfluencerContractsState.value.state === 'loaded')
  const isError = computed(() => getInfluencerContractsState.value.state === 'error')

  const scrollToPageTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const fetchContracts = async (params: PaginationWithPage) => {
    const {
      currentPageEntities: cachedContracts,
      calcEntitiesCount,
      extractCurrentEntities,
      updatedParams,
    } = fetchEntitiesFactory(params, contractsCache)

    if (cachedContracts) setInfluencerContracts(cachedContracts)

    if (extractCurrentEntities) {
      return await fetchInfluencerContracts(updatedParams).then((response) => {
        const { currentPageEntities } = extractCurrentEntities(response.data.contractTaskPairs)
        if (!cachedContracts) setInfluencerContracts(currentPageEntities)
        if (calcEntitiesCount) setInfluencerContractsCount(calcEntitiesCount(response.data.count))
      })
    }
  }

  const fetchContractsInitial = () => {
    fetchContracts({
      ...influencerContractsPagination,
      ...paginationPayload,
      targetPage: activePage.value,
    })
      .then(() => setInfluencerContractsState('loaded'))
      .catch((e) => setInfluencerContractsState('error', { message: e?.message }))

    clearPaginationPayload(paginationPayload)
  }

  const refetchContracts = () => {
    setInfluencerContractsState('loading')
    fetchContractsInitial()
  }

  const fetchContractFirstPage = () => {
    const contractsCached = contractsCache.get(1)

    if (contractsCached) setInfluencerContracts(contractsCached)
    if (!contractsCached) setInfluencerContractsState('loading')

    fetchContracts({
      skip: 0,
      limit: influencerContractsPerPage,
      targetPage: 1,
    })
      .then(() => setInfluencerContractsState('loaded'))
      .catch((e) => setInfluencerContractsState('error', { message: e?.message }))
  }

  const updatePage = (targetPage: number) => {
    scrollToPageTop()
    const firstContract = getFirstInfluencerContract()
    const lastContract = getLastInfluencerContract()

    paginationPayload.currentPage = activePage.value
    ;(paginationPayload.newerThanId = firstContract?.contract?.id),
      (paginationPayload.olderThanId = lastContract?.contract?.id),
      updateRouteParams({ page: targetPage })
  }

  const watchPageLimits = createPageLimitsWatcher(
    getInfluencerContracts,
    getInfluencerContractsCount,
    activePage,
    updatePage
  )

  const watchFilters = () => {
    watch(influencerContractsPagination, fetchContractsInitial)
  }

  return {
    getInfluencerContracts,
    getInfluencerContractsCount,
    getInfluencerContractsState,
    contractsPerPage: influencerContractsPerPage,
    activePage,
    isLoading,
    isLoaded,
    isError,
    fetchContractsInitial,
    fetchContractFirstPage,
    updatePage,
    watchPageLimits,
    refetchContracts,
    watchFilters,
  }
}
