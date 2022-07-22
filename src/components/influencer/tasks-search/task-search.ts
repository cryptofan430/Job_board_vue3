import { computed, watch } from 'vue'
import useAllTasksStore from '@/store/all-tasks'
import useTaskController from '@/middleware/controllers/useTaskController'
import useTasksFilters from '@/components/influencer/tasks-search/tasks-filters'
import { TaskFilters } from '@/types/tasks.model'
import { separateWords } from '@/components/helpers/strings'
import { clearPaginationPayload, createPageLimitsWatcher } from '@/components/helpers/api'

export default function useTasksSearch() {
  const { fetchAllTasks } = useTaskController()
  const { getAllTasks, getAllTasksCount, getAllTasksState, getFirstTask, getLastTask, setNewAllTasksState } =
    useAllTasksStore()

  const { tasksSearch, tasksPerPage, tasksFilters, tasksPagination, paginationPayload, updateRouteParams } =
    useTasksFilters()

  const activePage = computed(() => tasksPagination.skip / tasksPagination.limit + 1)
  const searchBarValue = computed(() => tasksSearch.keywords?.join(' ') || '')
  const isLoading = computed(() => getAllTasksState.value.state === 'loading')
  const isLoaded = computed(() => getAllTasksState.value.state === 'loaded')
  const isError = computed(() => getAllTasksState.value.state === 'error')

  const scrollToPageTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const fetchWithNewFilters = (newTasksFilters: TaskFilters) => {
    updateRouteParams({ ...newTasksFilters, page: 1 })
  }

  const resetFilters = () => {
    updateRouteParams({
      budgetGreaterEqual: undefined,
      budgetLowerEqual: undefined,
      platforms: undefined,
      keywords: undefined,
      page: 1,
    })
  }

  const fetchWithNewSearchBarValue = (searchBarValue: string) => {
    const separatedKeywords = separateWords(searchBarValue)

    updateRouteParams({
      keywords: separatedKeywords.join(','),
      page: 1,
    })
  }

  const updatePage = (targetPage: number) => {
    scrollToPageTop()
    const firstTask = getFirstTask()
    const lastTask = getLastTask()

    paginationPayload.currentPage = activePage.value
    paginationPayload.newerThanId = firstTask?.id
    paginationPayload.olderThanId = lastTask?.id

    updateRouteParams({ page: targetPage })
  }

  const fetchTasksWithNewParams = () => {
    fetchAllTasks({
      ...tasksFilters,
      ...tasksSearch,
      ...paginationPayload,
      ...tasksPagination,
      targetPage: activePage.value,
    })
    clearPaginationPayload(paginationPayload)
  }

  const refetchAllTasks = () => {
    setNewAllTasksState('loading')
    fetchTasksWithNewParams()
  }

  const watchPageLimits = createPageLimitsWatcher(getAllTasks, getAllTasksCount, activePage, updatePage)

  const watchFilters = () => {
    watch(tasksPagination, fetchTasksWithNewParams)
  }

  return {
    tasks: getAllTasks,
    tasksCount: getAllTasksCount,
    tasksPerPage,
    tasksFilters,
    tasksPagination,
    tasksSearch,
    isLoaded,
    isLoading,
    isError,
    activePage,
    searchBarValue,
    refetchAllTasks,
    fetchWithNewFilters,
    resetFilters,
    updatePage,
    fetchWithNewSearchBarValue,
    watchPageLimits,
    watchFilters,
  }
}
