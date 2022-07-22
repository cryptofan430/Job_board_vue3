import { fetchEntitiesFactory } from '@/components/helpers/api'
import api, { paramsToQueryString } from '@/services/api'
import useAllTasksStore from '@/store/all-tasks'
import { PaginationPages } from '@/types/api.model'
import { TasksQueryParams, TasksResponse } from '@/types/tasks.model'

const { allTasksCache, setAllTasks, setAllTasksCount, setNewAllTasksState } = useAllTasksStore()

const clearAllTasksCache = () => allTasksCache.clear()

const fetchTasks = async (params: TasksQueryParams) => {
  const {
    updatedParams,
    currentPageEntities: cachedTasks,
    extractCurrentEntities,
    calcEntitiesCount,
  } = fetchEntitiesFactory(params, allTasksCache)

  if (cachedTasks) setAllTasks(cachedTasks)

  if (extractCurrentEntities) {
    await api.get<TasksResponse>(`tasks/${paramsToQueryString(updatedParams)}`).then((response) => {
      const { currentPageEntities } = extractCurrentEntities(response.data.tasks)

      if (calcEntitiesCount) {
        const tasksCount = calcEntitiesCount(response.data.count)
        setAllTasksCount(tasksCount)
      }
      if (!cachedTasks) setAllTasks(currentPageEntities)
    })
  }
}

const fetchAllTasks = (params: TasksQueryParams & PaginationPages) => {
  return fetchTasks(params)
    .then(() => setNewAllTasksState('loaded'))
    .catch((e) => setNewAllTasksState('error', { message: e.message }))
}

export default function useAllTasksController() {
  return {
    fetchAllTasks,
    clearAllTasksCache,
  }
}
