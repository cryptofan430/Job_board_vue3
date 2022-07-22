import { computed, reactive, readonly, Ref, ref } from 'vue'
import { TaskPublicInfo, TasksLoadingState } from '@/types/tasks.model'
import { ApiLoadingState } from '@/types/api.model'

const marketerTasks = ref<Array<TaskPublicInfo>>([])
const marketerTasksCount: Ref<number> = ref(0)
const marketerTasksState = reactive<TasksLoadingState>({
  state: 'loading',
  payload: {
    message: undefined,
  },
})
const marketerTasksCache = new Map<number, TaskPublicInfo[]>()

export default function useMarketerTasksStore() {
  const getMarketerTasks = computed(() => marketerTasks.value)
  const getMarketerTasksCount = readonly(marketerTasksCount)
  const getMarketerTasksState = computed(() => marketerTasksState)

  const setMarketerTasks = (tasks: Array<TaskPublicInfo>) => {
    marketerTasks.value = tasks
  }
  const getFirstMarketerTask = () => marketerTasks.value[0] || null
  const getLastMarketerTask = () => marketerTasks.value[marketerTasks.value.length - 1] || null
  const setMarketerTasksCount = (newTasksCount: number) => (marketerTasksCount.value = newTasksCount)
  const reset = () => {
    marketerTasksCount.value = 0
    marketerTasks.value.length = 0
    marketerTasksState.state = 'loading'
    marketerTasksState.payload = { message: undefined }
    marketerTasksCache.clear()
  }

  const setNewMarketerTasksState = (state: ApiLoadingState, payload?: { message?: string }) => {
    marketerTasksState.state = state
    marketerTasksState.payload = payload
  }

  return {
    getMarketerTasks,
    getMarketerTasksCount,
    getMarketerTasksState,
    marketerTasksCache,
    reset,
    setMarketerTasks,
    setMarketerTasksCount,
    getFirstMarketerTask,
    getLastMarketerTask,
    setNewMarketerTasksState,
  }
}
