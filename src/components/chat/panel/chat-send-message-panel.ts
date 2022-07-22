import { computed, reactive, ref, watch } from 'vue'
import { errorMessagesToString } from '@/services/api'
import { ChatFileUploadPayload, SendMessageData } from '@/types/chat.model'
import { maxFileSize, maxFilesSizeMb } from '@/components/constants/files'
import axios, { AxiosError } from 'axios'
import useFileController from '@/middleware/controllers/useFileController'
import useWebsocket from '@/middleware/websockets/useWebsocket'
import useChatStore from '@/store/chat'
import useToastsStore from '@/store/toasts'

export default function useChatSendMessage() {
  const { addToast } = useToastsStore()
  const { uploadFile } = useFileController()
  const {
    chatPayloadCache,
    getMessageResponseTo,
    getFileUploadEntries,
    inputMessageText,
    getActiveChat,
    setFileUploadEntries,
    setMessageResponseTo,
    scrollToChatBottom,
    scrollContainer,
  } = useChatStore()
  const filesErrorText = ref<string | null>(null)
  const clearFileErrorText = () => (filesErrorText.value = null)

  const { sendMessage } = useWebsocket()
  const isAllFilesUploaded = computed(() => getFileUploadEntries.value.every((entry) => entry.isReady))

  const removeFileEntry = (fileEntry: ChatFileUploadPayload) => {
    if (fileEntry.cancelTokenSource) fileEntry.cancelTokenSource.cancel()
    const fileEntryIndex = getFileUploadEntries.value.findIndex(({ id }) => id === fileEntry.id)
    if (fileEntryIndex !== -1) getFileUploadEntries.value.splice(fileEntryIndex, 1)
  }

  const uploadFileEntry = async (fileEntry: ChatFileUploadPayload) => {
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

  const uploadFileEntries = async (fileEntries: ChatFileUploadPayload[]) => {
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

  const sendChatMessage = (fileEntries: ChatFileUploadPayload[], messageData: SendMessageData) => {
    const filesIds: Array<string> = fileEntries
      .map((fileEntry) => fileEntry.fileUploadedId)
      .filter(Boolean) as Array<string>
    const messagePayload: SendMessageData = {
      ...messageData,
      filesIds,
    }
    sendMessage(messagePayload)
    if (getActiveChat.value?.id === messageData.chatId) {
      inputMessageText.value = ''
      setFileUploadEntries([])
      setMessageResponseTo(null)
    }
    if (getActiveChat.value?.id !== messageData.chatId) {
      const currentChatCache = chatPayloadCache.get(messageData.chatId)
      if (currentChatCache) {
        currentChatCache.uploadFiles = reactive([])
        currentChatCache.responseMessage = null
        currentChatCache.inputMessageText = ''
      }
    }
  }

  const addMessage = async () => {
    const message = inputMessageText.value
    const chatId = getActiveChat.value?.id
    const clientsId = `${Date.now()}${Math.floor(Math.random() * 10000)}`
    const responseToMessageId = getMessageResponseTo.value?.id || undefined
    const fileEntries = getFileUploadEntries.value

    if ((message || fileEntries.length) && chatId) {
      const messageData: SendMessageData = {
        chatId,
        clientsId,
        message,
        responseToMessageId,
      }

      const isAllFilesUploaded = computed(() => fileEntries.every((entry) => entry.isReady))
      if (isAllFilesUploaded.value) sendChatMessage(fileEntries, messageData)
      if (!isAllFilesUploaded.value) {
        const unwatch = watch(isAllFilesUploaded, (isUploaded) => {
          if (isUploaded) {
            sendChatMessage(fileEntries, messageData)
            unwatch()
          }
        })
      }
    }
  }

  const handleFilesInput = (e: InputEvent) => {
    const inputEl = e.target as HTMLInputElement
    const files = Array.from(inputEl.files || [])
    inputEl.value = ''

    const currentFileEntries = getFileUploadEntries.value || []

    const validFiles = files.filter((file) => file.size <= maxFileSize)

    if (validFiles.length + currentFileEntries.length > 30) {
      validFiles.length = 30 - currentFileEntries.length
      filesErrorText.value = 'You can not attach more than 30 files to a single message'
    }

    const fileEntriesToUpload: ChatFileUploadPayload[] = validFiles.map((file) =>
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

    const container = scrollContainer.value
    const isScrolledToBottom =
      Math.abs((container?.scrollHeight || 0) - ((container?.scrollTop || 0) + (container?.offsetHeight || 0))) < 8

    if (isScrolledToBottom) setTimeout(scrollToChatBottom)

    uploadFileEntries(fileEntriesToUpload)
  }

  const chatReplyClose = () => {
    setMessageResponseTo(null)
  }

  return {
    filesErrorText,
    getFileUploadEntries,
    inputMessageText,
    isAllFilesUploaded,
    getMessageResponseTo,
    addMessage,
    handleFilesInput,
    clearFileErrorText,
    removeFileEntry,
    chatReplyClose,
  }
}
