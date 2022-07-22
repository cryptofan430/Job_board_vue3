import { computed, watch } from 'vue'
import { clearPaginationPayload, createPageLimitsWatcher, fetchEntitiesFactory } from '@/components/helpers/api'
import { PaginationWithPage } from '@/types/api.model'
import useMarketerTaskProposalsFilters from './marketer-task-proposals-params'
import useTaskStore from '@/store/task'
import useProposalController from '@/middleware/controllers/useProposalController'

export default function useMarketerTaskProposals() {
  const { fetchProposalsForTask } = useProposalController()

  const {
    getSelectedTask,
    getProposalsForSelectedTask,
    getProposalsStateForSelectedTask,
    marketerTaskProposalsCache,
    reset,
    getSelectedTaskFirstProposal,
    getSelectedTaskLastProposal,
    setSelectedTaskProposalsState,
    setSelectedTaskProposals,
  } = useTaskStore()

  const { taskId, proposalsPagination, proposalsPerPage, paginationPayload, updateRouteParams } =
    useMarketerTaskProposalsFilters()

  const proposalsCount = computed(() => getSelectedTask.value?.proposalCount || 0)

  const activePage = computed(() => proposalsPagination.skip / proposalsPagination.limit + 1)
  const isLoading = computed(() => getProposalsStateForSelectedTask.value.state === 'loading')
  const isLoaded = computed(() => getProposalsStateForSelectedTask.value.state === 'loaded')
  const isError = computed(() => getProposalsStateForSelectedTask.value.state === 'error')

  const scrollToPageTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const _fetchTaskProposals = async (params: PaginationWithPage) => {
    const {
      updatedParams,
      currentPageEntities: cachedEntities,
      extractCurrentEntities,
      calcEntitiesCount,
    } = fetchEntitiesFactory(params, marketerTaskProposalsCache)

    if (cachedEntities) setSelectedTaskProposals(cachedEntities)

    if (extractCurrentEntities) {
      return await fetchProposalsForTask(taskId, updatedParams).then((response) => {
        const { currentPageEntities } = extractCurrentEntities(response.data.proposals)

        if (calcEntitiesCount) {
          const proposalsCount = calcEntitiesCount(response.data.count)
          if (getSelectedTask.value) getSelectedTask.value.proposalCount = proposalsCount
        }

        if (!cachedEntities) setSelectedTaskProposals(currentPageEntities)
      })
    }
  }

  const updatePage = (targetPage: number) => {
    scrollToPageTop()
    const firstTask = getSelectedTaskFirstProposal()
    const lastTask = getSelectedTaskLastProposal()

    paginationPayload.currentPage = activePage.value
    paginationPayload.newerThanId = firstTask?.id
    paginationPayload.olderThanId = lastTask?.id

    updateRouteParams({ page: targetPage })
  }

  const fetchMarketerTaskProposalsInitial = () => {
    _fetchTaskProposals({
      ...proposalsPagination,
      ...paginationPayload,
      targetPage: activePage.value,
    })
      .then(() => {
        if (!marketerTaskProposalsCache.get(activePage.value)) marketerTaskProposalsCache.set(activePage.value, [])
        setSelectedTaskProposalsState('loaded')
      })
      .catch((e) => setSelectedTaskProposalsState('error', { message: e?.message }))

    clearPaginationPayload(paginationPayload)
  }

  const initMarketerTaskProposals = () => {
    const cachedEntities = marketerTaskProposalsCache.get(activePage.value)
    if (!cachedEntities) fetchMarketerTaskProposalsInitial()
    if (cachedEntities) setSelectedTaskProposals(cachedEntities)
  }

  const refetchProposals = () => {
    setSelectedTaskProposalsState('loading')
    fetchMarketerTaskProposalsInitial()
  }

  const resetMarketerTaskProposalsState = () => {
    reset()
  }

  const watchPageLimits = createPageLimitsWatcher(getProposalsForSelectedTask, proposalsCount, activePage, updatePage)

  const watchFilters = () => {
    watch(proposalsPagination, fetchMarketerTaskProposalsInitial)
  }

  return {
    proposals: getProposalsForSelectedTask,
    proposalsCount,
    proposalsPerPage,
    proposalsPagination,
    activeTask: getSelectedTask,
    isLoaded,
    isLoading,
    isError,
    activePage,
    taskId,
    fetchMarketerTaskProposalsInitial,
    initMarketerTaskProposals,
    updatePage,
    watchFilters,
    watchPageLimits,
    refetchProposals,
    resetMarketerTaskProposalsState,
  }
}
