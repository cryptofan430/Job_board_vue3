import { createFormFieldSet, createFormItem, useValidators } from '@/components/helpers/forms'
import { useStringPathParamReactive } from '@/components/helpers/route'
import { extractEntitiesLoadingState } from '@/components/helpers/state'
import useDisputesController from '@/middleware/controllers/useDisputesController'
import { getFirstError } from '@/services/api'
import useAdminDisputeStore from '@/store/admin-dispute'
import useToastsStore from '@/store/toasts'
import useUserStore from '@/store/user'
import { AdminJoinDisputeChatError, AdminJoinRegularChatError, DisputeCloseError } from '@/types/disputes'
import { AxiosError } from 'axios'
import { useRouter } from 'vue-router'

export default function useAdminDispute() {
  const disputeId = useStringPathParamReactive('id')
  const router = useRouter()
  const { getAdminDispute, adminDisputeState, setAdminDisputesState, setAdminDispute } = useAdminDisputeStore()
  const { getFullAdminDispute, adminJoinDisputeChat, adminJoinRegularChat, closeDispute } = useDisputesController()
  const { isError, isLoaded, isLoading } = extractEntitiesLoadingState(adminDisputeState)
  const { addToast } = useToastsStore()
  const { required, numberMinValue } = useValidators()
  const { getMyId } = useUserStore()

  const initDispute = () => {
    if (getAdminDispute.value?.disputeAdminInfo?.id !== disputeId?.value) {
      setAdminDispute(undefined)
    }
    if (!getAdminDispute.value) {
      setAdminDisputesState('loading')

      getFullAdminDispute(disputeId.value)
        .then((response) => {
          setAdminDispute(response.data)
          setAdminDisputesState('loaded')
        })
        .catch(() => {
          setAdminDisputesState('error')
        })
    }
  }

  const joinDisputeChat = () => {
    if (!getAdminDispute.value) return

    if (!getAdminDispute.value.disputeAdminInfo.joinedDisputeChat) {
      adminJoinDisputeChat(getAdminDispute.value.disputeAdminInfo.id)
        .then((response) => {
          router.push({
            name: 'SelectedChat',
            params: {
              chatId: response.data.chatId,
            },
          })
        })
        .catch((e: AxiosError) => {
          const error = getFirstError<AdminJoinDisputeChatError>(e)
          if (error?.errorType === AdminJoinDisputeChatError.DISPUTE_ALREADY_CLOSED) {
            addToast('Dispute is already closed', 'danger')
          } else if (error?.errorType === AdminJoinDisputeChatError.DISPUTE_NOT_EXIST) {
            addToast('Dispute chat does not exist', 'danger')
          } else if (error?.errorType === AdminJoinDisputeChatError.JOINED_CHAT_ALREADY) {
            addToast('You have already joined to dispute chat', 'danger')
          } else {
            addToast('Unexpected error occurred, please check your internet connection', 'danger')
          }
        })
    }
    if (getAdminDispute.value.disputeAdminInfo.joinedDisputeChat) {
      router.push({
        name: 'SelectedChat',
        params: {
          chatId: getAdminDispute.value?.disputeAdminInfo.chatId,
        },
      })
    }
  }

  const joinRegularChat = () => {
    if (!getAdminDispute.value) return

    if (!getAdminDispute.value.disputeAdminInfo.joinedRegularChat) {
      adminJoinRegularChat(getAdminDispute.value.disputeAdminInfo.id)
        .then(() => {
          router.push({
            name: 'SelectedChat',
            params: {
              chatId: getAdminDispute.value?.contractWithTask.chatId || '',
            },
          })
        })
        .catch((e: AxiosError) => {
          const error = getFirstError<AdminJoinRegularChatError>(e)
          if (error?.errorType === AdminJoinRegularChatError.CHAT_NOT_EXIST) {
            addToast('Chat does not exists', 'danger')
          } else if (error?.errorType === AdminJoinRegularChatError.CONTRACT_NOT_EXIST) {
            addToast('Contract does not exists', 'danger')
          } else if (error?.errorType === AdminJoinRegularChatError.DISPUTE_NOT_EXIST) {
            addToast('Dispute does not exists', 'danger')
          } else if (error?.errorType === AdminJoinRegularChatError.PROPOSAL_NOT_EXIST) {
            addToast('Proposal does not exist', 'danger')
          } else if (error?.errorType === AdminJoinRegularChatError.JOINED_CHAT_ALREADY) {
            addToast('You have already joined to dispute chat', 'danger')
          } else {
            addToast('Unexpected error occurred, please check your internet connection', 'danger')
          }
        })
    }
    if (getAdminDispute.value.disputeAdminInfo.joinedRegularChat) {
      router.push({
        name: 'SelectedChat',
        params: {
          chatId: getAdminDispute.value?.contractWithTask?.chatId,
        },
      })
    }
  }

  const createResolveDisputeForm = () => {
    const amountToInfluencer = createFormItem(0, {
      validators: [required, numberMinValue(0, () => 'The value should not be less then 0')],
    })
    const description = createFormItem('')

    return createFormFieldSet({
      amountToInfluencer,
      description,
    })
  }

  const resolveDisputeForm = createResolveDisputeForm()

  const resolveDispute = () => {
    const isFormValid = resolveDisputeForm.validate()

    if (isFormValid) {
      const formValue = resolveDisputeForm.getValue()
      closeDispute(disputeId.value, formValue)
        .then(() => {
          if (!getAdminDispute.value?.disputeAdminInfo?.userIds?.includes(getMyId.value as string)) {
            addToast('The dispute was closed', 'success')
          }
          router.push({ name: 'AdminDisputesPage' })
        })
        .catch((e: AxiosError) => {
          const error = getFirstError<DisputeCloseError>(e)

          if (error?.errorType === DisputeCloseError.DISPUTE_NOT_EXIST) {
            addToast('Dispute does not exist', 'danger')
          } else if (error?.errorType === DisputeCloseError.DISPUTE_ALREADY_CLOSED) {
            addToast('Dispute is already closed', 'danger')
          } else if (error?.errorType === DisputeCloseError.RELEASE_AMT_GREATER_THAN_BUDGET) {
            addToast('Amount of money that goes to influencer is greater than the budget', 'danger')
          } else {
            addToast('Unexpected error occurred, please check your internet connection', 'danger')
          }
        })
    }
  }

  return {
    resolveDisputeForm,
    getAdminDispute,
    joinDisputeChat,
    joinRegularChat,
    initDispute,
    resolveDispute,
    isError,
    isLoaded,
    isLoading,
  }
}
