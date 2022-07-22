import { computed, reactive, readonly, Ref, ref } from 'vue'
import { TaskPublicInfo, TasksLoadingState } from '@/types/tasks.model'
import { ApiLoadingState } from '@/types/api.model'

const allTasks = ref<Array<TaskPublicInfo>>([])
const allTasksCount: Ref<number> = ref(0)
const allTasksState = reactive<TasksLoadingState>({
  state: 'loading',
  payload: {
    message: undefined,
  },
})
const allTasksCache = new Map<number, TaskPublicInfo[]>()

export default function useAllTasksStore() {
  const getAllTasks = computed(() => allTasks.value)
  const getAllTasksCount = readonly(allTasksCount)
  const getAllTasksState = computed(() => allTasksState)

  const setAllTasks = (tasks: Array<TaskPublicInfo>) => {
    allTasks.value = tasks
  }
  const getFirstTask = () => allTasks.value[0] || null
  const getLastTask = () => allTasks.value[allTasks.value.length - 1] || null
  const setAllTasksCount = (newTasksCount: number) => (allTasksCount.value = newTasksCount)

  const setNewAllTasksState = (state: ApiLoadingState, payload?: { message?: string }) => {
    allTasksState.state = state
    allTasksState.payload = payload
  }

  const reset = () => {
    allTasksCount.value = 0
    allTasks.value = []
    allTasksState.state = 'loading'
    allTasksState.payload = { message: undefined }
    allTasksCache.clear()
  }

  return {
    getAllTasks,
    getAllTasksCount,
    getAllTasksState,
    allTasksCache,
    reset,
    setAllTasks,
    setAllTasksCount,
    getFirstTask,
    getLastTask,
    setNewAllTasksState,
  }
}
