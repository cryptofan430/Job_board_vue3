import { ref, computed } from 'vue'
import { ToastType, Toast } from '@/types/toast.model'

const TIMEOUT_VALUE = 4000

const toastsList = ref<Array<Toast>>([])
let _toastCounter = 0

const _generateID = () => _toastCounter++

const _removeToast = (id: number) => {
  toastsList.value = toastsList.value.filter((item) => item.id !== id)
}

const _createToast = (content: string, type: ToastType): Toast => {
  const id = _generateID()

  return {
    type,
    content,
    id,
    remove: () => {
      _removeToast(id)
    },
  }
}

export default function useToastsStore() {
  const addToast = (content: string, type: ToastType) => {
    const toast = _createToast(content, type)
    toastsList.value.push(toast)

    setTimeout(() => {
      toast.remove()
    }, TIMEOUT_VALUE)
  }

  const getToastsList = computed(() => toastsList.value)

  return {
    addToast,
    getToastsList,
  }
}
