import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios, { AxiosError } from 'axios'
import useTaskController from '@/middleware/controllers/useTaskController'
import useTaskStore from '@/store/task'
import { TaskToUpdate } from '@/types/tasks.model'
import { platforms } from '@/components/helpers/platforms'
import { ApiErrors } from '@/types/api.model'
import useFileController from '@/middleware/controllers/useFileController'
import useToastsStore from '@/store/toasts'
import { FileUploadPayload } from '@/types/file.model'
import { errorMessagesToString } from '@/services/api'
import { maxFilesCount, maxFileSize, maxFilesSizeMb } from '@/components/constants/files'

export default function useTaskEdit() {
  const taskController = useTaskController()
  const store = useTaskStore()
  const router = useRouter()

  const waitingForResponse = ref(false)
  const responseErrorMessage = ref('')
  const { uploadFile } = useFileController()
  const { addToast } = useToastsStore()

  const getFileUploadEntries = ref<FileUploadPayload[]>([])
  const filesErrorText = ref('')
  const clearFileErrorText = () => (filesErrorText.value = '')
  const closeErrorResponsePopup = () => {
    responseErrorMessage.value = ''
  }

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
  const update = (task: TaskToUpdate) => {
    waitingForResponse.value = true

    const formFilesIds = getFileUploadEntries.value
      .map((fileEntry) => fileEntry.fileUploadedId)
      .filter(Boolean) as Array<string>

    const existingFilesIds = store.getSelectedTask?.value?.files.map((file) => file.id) || []

    const taskToUpdate: TaskToUpdate = {
      ...task,
      filesIds: [...formFilesIds, ...existingFilesIds],
    }

    taskController
      .updateTask(taskToUpdate)
      .then((response) => {
        store.setSelectedTask(response.data)
        router.push(`/m/tasks/${response.data.id}`)
      })
      .catch((error: AxiosError) => {
        if (error?.response?.data?.errors) {
          const requestErrors = error.response.data.errors as ApiErrors

          requestErrors.forEach((e) => {
            if (!responseErrorMessage.value.length) {
              responseErrorMessage.value = e.message
            } else {
              responseErrorMessage.value = `${responseErrorMessage.value}\n${e.message}`
            }
          })
        }

        waitingForResponse.value = false
      })
  }

  return {
    platforms,
    waitingForResponse,
    responseErrorMessage,
    getFileUploadEntries,
    filesErrorText,
    update,
    clearFileErrorText,
    handleFilesInput,
    removeFileEntry,
    closeErrorResponsePopup,
  }
}
