import { computed, watch } from 'vue'
import useMarketerTaskFilters from '@/components/marketer/dashboard/marketer-tasks-params'
import useMarketerTasksStore from '@/store/marketer-tasks'
import { clearPaginationPayload, createPageLimitsWatcher, fetchEntitiesFactory } from '@/components/helpers/api'
import { PaginationWithPage } from '@/types/api.model'
import useTaskController from '@/middleware/controllers/useTaskController'

export default function useMarketerTasks() {
  const { fetchMarketerTasks } = useTaskController()
  const {
    getMarketerTasks,
    getMarketerTasksCount,
    getMarketerTasksState,
    marketerTasksCache,
    getFirstMarketerTask,
    getLastMarketerTask,
    setMarketerTasks,
    setMarketerTasksCount,
    setNewMarketerTasksState,
  } = useMarketerTasksStore()

  const { tasksPagination, marketerTasksPerPage, paginationPayload, updateRouteParams } = useMarketerTaskFilters()

  const activePage = computed(() => tasksPagination.skip / tasksPagination.limit + 1)
  const isLoading = computed(() => getMarketerTasksState.value.state === 'loading')
  const isLoaded = computed(() => getMarketerTasksState.value.state === 'loaded')
  const isError = computed(() => getMarketerTasksState.value.state === 'error')

  const scrollToPageTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const _fetchTasks = async (params: PaginationWithPage) => {
    const {
      updatedParams,
      currentPageEntities: cachedTasks,
      extractCurrentEntities,
      calcEntitiesCount,
    } = fetchEntitiesFactory(params, marketerTasksCache)

    if (cachedTasks) {
      setMarketerTasks(cachedTasks)
    }

    if (extractCurrentEntities) {
      return await fetchMarketerTasks(updatedParams).then((response) => {
        const { currentPageEntities } = extractCurrentEntities(response.data.tasks)

        if (calcEntitiesCount) {
          const tasksCount = calcEntitiesCount(response.data.count)
          setMarketerTasksCount(tasksCount)
        }

        if (!cachedTasks) setMarketerTasks(currentPageEntities)
      })
    }
  }

  const updatePage = (targetPage: number) => {
    scrollToPageTop()
    const firstTask = getFirstMarketerTask()
    const lastTask = getLastMarketerTask()

    paginationPayload.currentPage = activePage.value
    paginationPayload.newerThanId = firstTask?.id
    paginationPayload.olderThanId = lastTask?.id

    updateRouteParams({ page: targetPage })
  }

  const fetchMarketerTasksInitial = () => {
    _fetchTasks({
      ...tasksPagination,
      ...paginationPayload,
      targetPage: activePage.value,
    })
      .then(() => setNewMarketerTasksState('loaded'))
      .catch((e) => setNewMarketerTasksState('error', { message: e.message }))

    clearPaginationPayload(paginationPayload)
  }

  const fetchMarketerTasksFirstPage = () => {
    if (!marketerTasksCache.get(1)) {
      setNewMarketerTasksState('loading')
    }

    _fetchTasks({ skip: 0, limit: marketerTasksPerPage, targetPage: 1 })
      .then(() => setNewMarketerTasksState('loaded'))
      .catch((e) => setNewMarketerTasksState('error', { message: e?.message }))
  }

  const refetchMarketerTasks = () => {
    setNewMarketerTasksState('loading')
    fetchMarketerTasksInitial()
  }

  const watchPageLimits = createPageLimitsWatcher(getMarketerTasks, getMarketerTasksCount, activePage, updatePage)
  const watchFilters = () => {
    watch(tasksPagination, fetchMarketerTasksInitial)
  }

  return {
    tasks: getMarketerTasks,
    tasksCount: getMarketerTasksCount,
    perPage: marketerTasksPerPage,
    tasksPagination,
    isLoaded,
    isLoading,
    isError,
    activePage,
    fetchMarketerTasksFirstPage,
    refetchMarketerTasks,
    fetchMarketerTasksInitial,
    updatePage,
    watchFilters,
    watchPageLimits,
  }
}
