import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { TaskToCreate } from '@/types/tasks.model'
import { platforms } from '@/components/helpers/platforms'
import { errorMessagesToString } from '@/services/api'
import { useTaskCreateForm } from './task-create-form'
import { maxFilesCount, maxFileSize, maxFilesSizeMb } from '@/components/constants/files'
import { FileUploadPayload } from '@/types/file.model'
import useTaskStore from '@/store/task'
import useTaskController from '@/middleware/controllers/useTaskController'
import axios, { AxiosError } from 'axios'
import useToastsStore from '@/store/toasts'
import useFileController from '@/middleware/controllers/useFileController'
import { Currency } from '@/types/money.model'
import useMarketerTasksStore from '@/store/marketer-tasks'
import useMyTasksStore from '@/store/my-tasks'

export default function useTaskCreate() {
  const taskController = useTaskController()
  const store = useTaskStore()
  const router = useRouter()
  const { uploadFile } = useFileController()
  const { taskCreateForm } = useTaskCreateForm()
  const { addToast } = useToastsStore()
  const { reset: resetTasksDashboard } = useMarketerTasksStore()
  const { reset: resetMyTaskStore } = useMyTasksStore()

  const waitingForResponse = ref(false)
  const responseErrorMessage = ref('')
  const getFileUploadEntries = ref<FileUploadPayload[]>([])
  const filesErrorText = ref('')
  const clearFileErrorText = () => (filesErrorText.value = '')
  const closeErrorResponsePopup = () => {
    responseErrorMessage.value = ''
  }

  const isAllFilesUploaded = computed(() => {
    const files = getFileUploadEntries.value || []
    return files.every((file) => file.isReady)
  })

  const removeFileEntry = (fileEntry: FileUploadPayload) => {
    if (fileEntry.cancelTokenSource) fileEntry.cancelTokenSource.cancel()
    const fileEntryIndex = getFileUploadEntries.value.findIndex(({ id }) => id === fileEntry.id)
    if (fileEntryIndex !== -1) getFileUploadEntries.value.splice(fileEntryIndex, 1)
  }

  const uploadFileEntry = async (fileEntry: FileUploadPayload) => {
    const fileForm = new FormData()
    fileForm.append('file', fileEntry.file)

    const onUploadProgress = (progressEvent: ProgressEvent) => {
      const ratio = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      fileEntry.progress = ratio
    }

    const cancelTokenSource = axios.CancelToken.source()
    fileEntry.cancelTokenSource = cancelTokenSource
    const cancelToken = cancelTokenSource.token

    try {
      return await uploadFile(fileForm, { onUploadProgress, cancelToken })
    } catch (e) {
      if (!axios.isCancel(e)) {
        removeFileEntry(fileEntry)
        throw e
      }
    } finally {
      fileEntry.isReady = true
      fileEntry.cancelTokenSource = undefined
      fileEntry.progress = null
    }
  }

  const uploadFileEntries = async (fileEntries: FileUploadPayload[]) => {
    try {
      for (const fileEntry of fileEntries) {
        const fileResponse = await uploadFileEntry(fileEntry)
        if (fileResponse) fileEntry.fileUploadedId = fileResponse.data.id
      }
    } catch (e) {
      const error = errorMessagesToString(e as AxiosError) || 'Error during upload of files'
      addToast(error, 'danger')
    }
  }

  const handleFilesInput = (e: InputEvent) => {
    const inputEl = e.target as HTMLInputElement
    const files = Array.from(inputEl.files || [])
    inputEl.value = ''

    const currentFileEntries = getFileUploadEntries.value || []

    const validFiles = files.filter((file) => file.size <= maxFileSize)

    if (validFiles.length + currentFileEntries.length > maxFilesCount) {
      validFiles.length = maxFilesCount - currentFileEntries.length
      filesErrorText.value = `You can not attach more than ${maxFilesCount} files to a single message`
    }

    const fileEntriesToUpload: FileUploadPayload[] = validFiles.map((file) =>
      reactive({
        id: Date.now() + Math.random().toString(),
        file,
        progress: 0,
        isReady: false,
      })
    )

    currentFileEntries.push(...fileEntriesToUpload)
    if (validFiles.length !== files.length)
      filesErrorText.value = `The size of an attached file should not be more than ${maxFilesSizeMb}MB`

    uploadFileEntries(fileEntriesToUpload)
  }

  // todo:
  // - error handling for addTask
  const createTask = () => {
    const taskFormData = taskCreateForm.getValue()
    const filesIds = getFileUploadEntries.value
      .map((fileEntry) => fileEntry.fileUploadedId)
      .filter(Boolean) as Array<string>

    const taskToCreate: TaskToCreate = {
      ...taskFormData,
      budget: {
        currency: taskFormData.budget.currency as Currency,
        value: taskFormData.budget.value,
      },
      filesIds,
    }

    taskController
      .addTask(taskToCreate)
      .then((response) => {
        store.setSelectedTask(response.data)
        router.push(`/m/tasks/${response.data.id}`)
      })
      .catch((error: AxiosError) => {
        responseErrorMessage.value = errorMessagesToString(error)
        waitingForResponse.value = false
      })
  }

  const submitCreateForm = () => {
    const isValid = taskCreateForm.validate()
    if (!isValid) return
    resetTasksDashboard()
    resetMyTaskStore()

    waitingForResponse.value = true
    const fileEntries = getFileUploadEntries.value
    const isAllFilesUploaded = computed(() => fileEntries.every((entry) => entry.isReady))

    if (isAllFilesUploaded.value) createTask()
    if (!isAllFilesUploaded.value) {
      const unwatch = watch(isAllFilesUploaded, (isUploaded) => {
        if (isUploaded) {
          createTask()
          unwatch()
        }
      })
    }
  }

  return {
    filesErrorText,
    getFileUploadEntries,
    taskCreateForm,
    platforms,
    waitingForResponse,
    responseErrorMessage,
    isAllFilesUploaded,
    submitCreateForm,
    closeErrorResponsePopup,
    handleFilesInput,
    removeFileEntry,
    clearFileErrorText,
  }
}
