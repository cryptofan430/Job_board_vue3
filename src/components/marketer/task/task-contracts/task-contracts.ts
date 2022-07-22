import { computed, watch } from 'vue'
import { clearPaginationPayload, createPageLimitsWatcher, fetchEntitiesFactory } from '@/components/helpers/api'
import { PaginationWithPage } from '@/types/api.model'
import useContractController from '@/middleware/controllers/useContractController'
import useMarketerContractsStore from '@/store/marketer-task-contracts'
import useMarketerContractsFilters from '@/components/marketer/task/task-contracts/task-contracts-params'

export default function useMarketerTaskContracts() {
  const { fetchContractsForTask } = useContractController()
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
    reset,
  } = useMarketerContractsStore()

  const { marketerContractsPagination, marketerContractsPerPage, paginationPayload, taskId, updateRouteParams } =
    useMarketerContractsFilters()

  const activePage = computed(() => marketerContractsPagination.skip / marketerContractsPagination.limit + 1)
  const isLoading = computed(() => getMarketerContractsState.value.state === 'loading')
  const isLoaded = computed(() => getMarketerContractsState.value.state === 'loaded')
  const isError = computed(() => getMarketerContractsState.value.state === 'error')

  const scrollToPageTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const _fetchContracts = async (params: PaginationWithPage) => {
    const {
      currentPageEntities: cachedContracts,
      calcEntitiesCount,
      extractCurrentEntities,
      updatedParams,
    } = fetchEntitiesFactory(params, contractsCache)

    if (cachedContracts) setMarketerContracts(cachedContracts)

    if (extractCurrentEntities) {
      return await fetchContractsForTask(taskId, updatedParams).then((response) => {
        const { currentPageEntities } = extractCurrentEntities(response.data.contracts)
        if (!cachedContracts) setMarketerContracts(currentPageEntities)
        if (calcEntitiesCount) setMarketerContractsCount(calcEntitiesCount(response.data.count))
      })
    }
  }

  const fetchContractsInitial = () => {
    _fetchContracts({
      ...marketerContractsPagination,
      ...paginationPayload,
      targetPage: activePage.value,
    })
      .then(() => {
        if (!contractsCache.get(activePage.value)) contractsCache.set(activePage.value, [])
        setMarketerContractsState('loaded')
      })
      .catch((e) => setMarketerContractsState('error', { message: e?.message }))

    clearPaginationPayload(paginationPayload)
  }

  const refetchContracts = () => {
    setMarketerContractsState('loading')
    fetchContractsInitial()
  }

  const initMarketerTaskContracts = () => {
    const cachedEntities = contractsCache.get(activePage.value)
    if (!cachedEntities) fetchContractsInitial()
    if (cachedEntities) setMarketerContracts(cachedEntities)
  }

  const resetTaskContractsState = () => {
    reset()
  }

  const updatePage = (targetPage: number) => {
    scrollToPageTop()
    const firstContract = getFirstMarketerContract()
    const lastContract = getLastMarketerContract()

    paginationPayload.currentPage = activePage.value
    paginationPayload.newerThanId = firstContract?.contract?.id
    paginationPayload.olderThanId = lastContract.contract?.id

    updateRouteParams({ page: targetPage })
  }

  const watchPageLimits = createPageLimitsWatcher(
    getMarketerContracts,
    getMarketerContractsCount,
    activePage,
    updatePage
  )

  const watchFilters = () => {
    watch(marketerContractsPagination, fetchContractsInitial)
  }

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
    initMarketerTaskContracts,
    updatePage,
    watchPageLimits,
    watchFilters,
    resetTaskContractsState,
    refetchContracts,
  }
}
