import { computed, ref } from 'vue'
import { TaskPublicInfo } from '@/types/tasks.model'

const myTasks = ref<Array<TaskPublicInfo>>([])

export default function useMyTasksStore() {
  const setMyTasks = (tasks: Array<TaskPublicInfo>) => {
    myTasks.value = tasks
  }
  const getMyTasks = computed(() => myTasks.value)
  const removeOneMyTask = (id: string) => {
    myTasks.value = myTasks.value.filter((task) => task.id !== id)
  }

  const reset = () => {
    myTasks.value = []
  }

  return {
    setMyTasks,
    getMyTasks,
    removeOneMyTask,
    reset,
  }
}
