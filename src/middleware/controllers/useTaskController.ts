import api, { paramsToQueryString } from '@/services/api'
import { MyTasksQueryParams, TaskPublicInfo, TasksResponse, TaskToCreate, TaskToUpdate } from '@/types/tasks.model'
import { BasicPagination } from '@/types/api.model'
import useMyTasksStore from '@/store/my-tasks'
import useTaskStore from '@/store/task'
import useAllTasksController from './useAllTasksController'

const { setMyTasks, removeOneMyTask } = useMyTasksStore()

const { setSelectedTask } = useTaskStore()

const addTask = async (task: TaskToCreate) => {
  return await api.post<TaskPublicInfo>('tasks', task)
}

const deleteTask = async (id: string) => {
  return await api.delete<Record<string, never>>(`tasks/${id}`).then((response) => {
    removeOneMyTask(id)
    return response
  })
}

const updateTask = async (task: TaskToUpdate) => {
  return await api.put<TaskPublicInfo>('tasks/update', task)
}

const fetchMyTasks = async (params: MyTasksQueryParams) => {
  return await api.get<TasksResponse>(`tasks/my/${paramsToQueryString(params)}`).then((response) => {
    setMyTasks(response.data.tasks)
    return response
  })
}

const fetchMarketerTasks = async (params?: BasicPagination) => {
  return await api.get<TasksResponse>(`tasks/my/${paramsToQueryString(params)}`)
}

const fetchTask = async (id: string) => {
  return await api.get<TaskPublicInfo>(`tasks/${id}`).then((response) => {
    setSelectedTask(response.data)
    return response
  })
}

const fetchTaskById = async (id: string) => {
  return await api.get<TaskPublicInfo>(`tasks/${id}`)
}

export default function useTaskController() {
  const { clearAllTasksCache, fetchAllTasks } = useAllTasksController()

  return {
    addTask,
    deleteTask,
    updateTask,
    fetchMyTasks,
    fetchAllTasks,
    fetchTask,
    fetchTaskById,
    fetchMarketerTasks,
    clearAllTasksCache,
  }
}
