import { useRouter } from 'vue-router'
import { useStringPathParamReactive } from '@/components/helpers/route'
import { extractEntitiesLoadingState } from '@/components/helpers/state'
import useContractController from '@/middleware/controllers/useContractController'
import useContractAcceptStore from '@/store/contract-accept'
import useContractManagementStore from '@/store/influencer-contract-management'
import useToastsStore from '@/store/toasts'
import useChatController from '@/middleware/controllers/useChatController'
import useDisputesController from '@/middleware/controllers/useDisputesController'
import { AxiosError } from 'axios'
import { getFirstError } from '@/services/api'
import { CreateDisputeError } from '@/types/disputes'
import { computed, ref } from 'vue'
import { ContractMilestonePublicInfo } from '@/types/contract.model'

export default function useInfluencerContractManagement() {
  const router = useRouter()
  const contractId = useStringPathParamReactive('contractId')
  const { fetchContractWithTask } = useContractController()
  const { getTaskContract, taskContactState, setTaskContract, setTaskContractsState } = useContractManagementStore()
  const { setTaskContract: setAcceptTaskContract } = useContractAcceptStore()
  const { openDispute } = useDisputesController()
  const { createChat } = useChatController()
  const { addToast } = useToastsStore()

  const isOpeningDispute = ref(false)
  const isExecutingAction = computed(() => isOpeningDispute.value)

  const redirectToChat = (chatId: string) => router.push(`/chat/${chatId}`)

  const { isError, isLoaded, isLoading } = extractEntitiesLoadingState(taskContactState)

  const initTaskContract = () => {
    if (getTaskContract.value?.contract?.id !== contractId.value) setTaskContract(undefined)
    if (getTaskContract.value?.contract && !getTaskContract.value?.contract?.accepted) {
      setAcceptTaskContract(getTaskContract.value)
      const taskId = getTaskContract.value?.task?.id || ''
      return router.push({
        name: 'ContractAccept',
        params: { taskId, contractId: contractId.value },
      })
    }

    if (!getTaskContract.value) {
      setTaskContractsState('loading')
      fetchContractWithTask(contractId.value)
        .then((response) => {
          setTaskContractsState('loaded')
          if (!response.data.contract?.accepted) {
            const taskId = response.data.task?.id || ''
            setAcceptTaskContract(response.data)
            return router.push({
              name: 'ContractAccept',
              params: { taskId, contractId: contractId.value },
            })
          }
          setTaskContract(response.data)
        })
        .catch(() => {
          setTaskContractsState('error')
        })
    }
  }

  const doOpenDispute = (milestone: ContractMilestonePublicInfo) => {
    isOpeningDispute.value = true

    const currentTaskContract = getTaskContract.value

    const removeMilestone = () => {
      const removeIndex = currentTaskContract?.contract.milestones.findIndex(({ id }) => milestone.id === id) || -1

      if (removeIndex !== -1) currentTaskContract?.contract.milestones.splice(removeIndex, 1)
    }

    openDispute(contractId.value, milestone.id)
      .then((response) => {
        addToast('Successfully opened a dispute', 'success')
        router.push({ name: 'SelectedChat', params: { chatId: response.data.chatId } })
      })
      .catch((e: AxiosError) => {
        const error = getFirstError<CreateDisputeError>(e)
        if (error?.errorType === CreateDisputeError.CONTRACT_NOT_BELONG_TO_USER) {
          addToast('Contract does not belong to you', 'danger')
          return router.push({ name: 'Dashboard' })
        } else if (error?.errorType === CreateDisputeError.CONTRACT_NOT_EXIST) {
          addToast('Contract does not exist', 'danger')
          return router.push({ name: 'Dashboard' })
        } else if (error?.errorType === CreateDisputeError.DAILY_LIMIT_REACHED) {
          addToast('You reached the daily limit of actions', 'danger')
        } else if (error?.errorType === CreateDisputeError.DISPUTE_ALREADY_EXIST) {
          addToast('This milestone does not exist', 'danger')
          removeMilestone()
        } else if (error?.errorType === CreateDisputeError.UNABLE_TO_DISPUTE_NOT_SECURED_MILESTONE) {
          addToast('Unable to dispute on not secured milestone', 'danger')
        } else {
          addToast(
            'Unexpected error occurred when opening a dispute, please check your internet connection and try again',
            'danger'
          )
        }
      })
      .finally(() => {
        isOpeningDispute.value = false
      })
  }

  const goToChat = async () => {
    const { chatId, proposalId } = getTaskContract.value || {}

    if (chatId) redirectToChat(chatId)
    if (!chatId && proposalId) {
      await createChat(proposalId)
        .then((response) => {
          redirectToChat(response.data.id)
        })
        .catch(() => addToast('Failed to create a chat', 'danger'))
    }
  }

  return {
    isExecutingAction,
    isError,
    isLoaded,
    isLoading,
    getTaskContract,
    initTaskContract,
    setTaskContract,
    setTaskContractsState,
    goToChat,
    doOpenDispute,
  }
}
