import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useTaskController from '@/middleware/controllers/useTaskController'

const isLoading = ref(false)
const showLoadingError = ref(false)

export default function useTaskDetails() {
  const { fetchTask } = useTaskController()
  const router = useRouter()

  const loadTask = () => {
    if (isLoading.value) return

    const taskId = router.currentRoute.value.params.taskId as string

    isLoading.value = true
    showLoadingError.value = false

    fetchTask(taskId)
      .catch(() => {
        showLoadingError.value = true
      })
      .finally(() => {
        isLoading.value = false
      })
  }

  const reset = () => {
    isLoading.value = false
    showLoadingError.value = false
  }

  return {
    loadTask,
    isLoading,
    showLoadingError,
    reset,
  }
}
