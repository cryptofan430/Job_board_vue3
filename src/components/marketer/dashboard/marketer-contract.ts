import { computed, watch } from 'vue'
import { clearPaginationPayload, createPageLimitsWatcher, fetchEntitiesFactory } from '@/components/helpers/api'
import { PaginationWithPage } from '@/types/api.model'
import useContractController from '@/middleware/controllers/useContractController'
import useMarketerContractsStore from '@/store/marketer-all-contracts'
import useMarketerContractsFilters from '@/components/marketer/dashboard/marketer-contract-params'

export default function useMarketerContracts() {
  const { fetchMarketerContracts } = useContractController()
  const {
    getMarketerContracts,
    getMarketerContractsCount,
    getMarketerContractsState,
    contractsCache,
    getFirstMarketerContract,
    getLastMarketerContract,
    setMarketerContracts,
    setMarketerContractsCount,
    setMarketerContractsState,
  } = useMarketerContractsStore()

  const { marketerContractsPagination, marketerContractsPerPage, paginationPayload, updateRouteParams } =
    useMarketerContractsFilters()

  const activePage = computed(() => marketerContractsPagination.skip / marketerContractsPagination.limit + 1)
  const isLoading = computed(() => getMarketerContractsState.value.state === 'loading')
  const isLoaded = computed(() => getMarketerContractsState.value.state === 'loaded')
  const isError = computed(() => getMarketerContractsState.value.state === 'error')

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

    if (cachedContracts) setMarketerContracts(cachedContracts)

    if (extractCurrentEntities) {
      return await fetchMarketerContracts(updatedParams).then((response) => {
        const { currentPageEntities } = extractCurrentEntities(response.data.contractTaskPairs)
        if (!cachedContracts) setMarketerContracts(currentPageEntities)
        if (calcEntitiesCount) setMarketerContractsCount(calcEntitiesCount(response.data.count))
      })
    }
  }

  const fetchContractsInitial = () => {
    fetchContracts({
      ...marketerContractsPagination,
      ...paginationPayload,
      targetPage: activePage.value,
    })
      .then(() => setMarketerContractsState('loaded'))
      .catch((e) => setMarketerContractsState('error', { message: e?.message }))

    clearPaginationPayload(paginationPayload)
  }

  const fetchContractFirstPage = () => {
    if (!contractsCache.get(1)) {
      setMarketerContractsState('loading')
    }

    fetchContracts({ skip: 0, limit: marketerContractsPerPage, targetPage: 1 })
      .then(() => setMarketerContractsState('loaded'))
      .catch((e) => setMarketerContractsState('error', { message: e?.message }))
  }

  const refetchContracts = () => {
    setMarketerContractsState('loading')

    fetchContractsInitial()
  }

  const updatePage = (targetPage: number) => {
    scrollToPageTop()
    const firstContract = getFirstMarketerContract()
    const lastContract = getLastMarketerContract()

    paginationPayload.newerThanId = firstContract?.contract?.id
    paginationPayload.olderThanId = lastContract?.contract?.id
    paginationPayload.currentPage = activePage.value

    updateRouteParams({ page: targetPage })
  }

  const watchFilters = () => {
    watch(marketerContractsPagination, fetchContractsInitial)
  }

  const watchPageLimits = createPageLimitsWatcher(
    getMarketerContracts,
    getMarketerContractsCount,
    activePage,
    updatePage
  )

  return {
    getMarketerContracts,
    getMarketerContractsCount,
    getMarketerContractsState,
    contractsPerPage: marketerContractsPerPage,
    activePage,
    isLoading,
    isLoaded,
    isError,
    fetchContractsInitial,
    fetchContractFirstPage,
    refetchContracts,
    updatePage,
    watchPageLimits,
    watchFilters,
  }
}
