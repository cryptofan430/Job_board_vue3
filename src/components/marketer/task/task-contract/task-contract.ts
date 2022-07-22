import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStringPathParamReactive } from '@/components/helpers/route'
import { extractEntitiesLoadingState } from '@/components/helpers/state'
import { errorMessagesToString, getFirstError } from '@/services/api'
import {
  ContractEndErrors,
  ContractMilestonePublicInfo,
  ContractWithTask,
  MilestoneDeleteError,
  MilestoneReleaseError,
  MilestoneSecureError,
  MilestoneState,
} from '@/types/contract.model'
import { AxiosError } from 'axios'
import useContractController from '@/middleware/controllers/useContractController'
import useMarketerTaskContractStore from '@/store/marketer-task-contract'
import useToastsStore from '@/store/toasts'
import useChatController from '@/middleware/controllers/useChatController'
import useDisputesController from '@/middleware/controllers/useDisputesController'
import { CreateDisputeError } from '@/types/disputes'

export default function useTaskContract() {
  const router = useRouter()
  const contractId = useStringPathParamReactive('contractId')
  const { getMarketerTaskContract, marketerContactState, setMarketerContractState, setMarketerTaskContract } =
    useMarketerTaskContractStore()
  const { fetchContractWithTask, secureMilestoneMoney, releaseMilestoneMoney, deleteMilestone, endContract } =
    useContractController()
  const { addToast } = useToastsStore()
  const { createChat } = useChatController()
  const { openDispute } = useDisputesController()
  const { isError, isLoading, isLoaded } = extractEntitiesLoadingState(marketerContactState)

  const isSecuringMilestone = ref(false)
  const isReleasingMilestone = ref(false)
  const isDeletingMilestone = ref(false)
  const isOpeningDispute = ref(false)
  const isEndingContract = ref(false)

  const isExecutingAction = computed(
    () =>
      isSecuringMilestone.value ||
      isReleasingMilestone.value ||
      isDeletingMilestone.value ||
      isEndingContract.value ||
      isOpeningDispute.value
  )

  const isShowLeaveReview = computed(
    () => getMarketerTaskContract.value?.contract?.ended && !getMarketerTaskContract.value.contract?.influencerReviewed
  )

  const initTaskContract = () => {
    if (getMarketerTaskContract.value?.contract?.id !== contractId.value) setMarketerTaskContract(undefined)

    if (!getMarketerTaskContract.value) {
      setMarketerContractState('loading')
      fetchContractWithTask(contractId.value)
        .then((response) => {
          setMarketerContractState('loaded')
          setMarketerTaskContract(response.data)
        })
        .catch(() => {
          setMarketerContractState('error')
        })
    }
  }

  const secureMilestone = (milestone: ContractMilestonePublicInfo) => {
    if (!getMarketerTaskContract.value) return
    const currentContractId = getMarketerTaskContract.value?.contract.id || contractId.value
    const currentTaskContract = getMarketerTaskContract.value

    const removeMilestone = () => {
      const removeIndex = currentTaskContract.contract.milestones.findIndex(({ id }) => milestone.id === id)

      if (removeIndex !== -1) currentTaskContract.contract.milestones.splice(removeIndex, 1)
    }

    isSecuringMilestone.value = true
    secureMilestoneMoney(currentContractId, milestone.id)
      .then((response) => {
        const updatedTaskContract: ContractWithTask = {
          ...currentTaskContract,
          contract: response.data,
        }
        console.log(response.data)
        setMarketerTaskContract(updatedTaskContract)
        addToast('Milestone secured', 'success')
      })
      .catch((e: AxiosError) => {
        const error = getFirstError<MilestoneSecureError>(e)
        let errorMessage = errorMessagesToString(e)
        try {
          if (error?.errorType === MilestoneSecureError.CONTRACT_NOT_BELONG_TO_USER) {
            errorMessage = 'This contract does not belong to you'
            return router.push({ name: 'Dashboard' })
          }
          if (error?.errorType === MilestoneSecureError.CONTRACT_NOT_EXIST) {
            errorMessage = 'This contract does not exists'
            return router.push({ name: 'Dashboard' })
          }
          if (error?.errorType === MilestoneSecureError.MILESTONE_NOT_EXIST) {
            errorMessage = 'This milestone does not exists'
            removeMilestone()
          }
          if (error?.errorType === MilestoneSecureError.UNABLE_TO_MODIFY_ENDED_CONTRACT) {
            errorMessage = "You can't modify contract that has been ended already"
            currentTaskContract.contract.ended = true
          }
          if (error?.errorType === MilestoneSecureError.UNABLE_TO_RELEASE_MILESTONE) {
            errorMessage = 'Unable to release milestone'
          }
          if (error?.errorType === MilestoneSecureError.UNABLE_TO_SECURE_MONEY_IN_NOT_ACCEPTED_CONTRACT) {
            errorMessage = 'Unable to secure milestone in not accepted contract'
            currentTaskContract.contract.accepted = false
          }
          if (error?.errorType === MilestoneSecureError.UNABLE_TO_SECURE_NOT_NOT_SECURED_MILESTONE) {
            errorMessage = "Unable to secure milestone that's already secured"
            milestone.state = MilestoneState.SECURED
          }
          if (error?.errorType === MilestoneSecureError.NOT_ENOUGH_MONEY) {
            errorMessage = 'You have not enough money to secure the milestone'
          }
        } finally {
          addToast(errorMessage || 'Unexpected error occurred during securing milestone', 'danger')
        }
      })
      .finally(() => {
        isSecuringMilestone.value = false
      })
  }

  const redirectToChat = (chatId: string) => router.push(`/chat/${chatId}`)

  const goToChat = async () => {
    const { chatId, proposalId } = getMarketerTaskContract.value || {}

    if (chatId) redirectToChat(chatId)
    if (!chatId && proposalId) {
      await createChat(proposalId)
        .then((response) => {
          redirectToChat(response.data.id)
        })
        .catch(() => addToast('Failed to create a chat', 'danger'))
    }
  }

  const releaseMilestone = (milestone: ContractMilestonePublicInfo) => {
    if (!getMarketerTaskContract.value) return
    const currentContractId = getMarketerTaskContract.value?.contract.id || contractId.value
    const currentTaskContract = getMarketerTaskContract.value

    const removeMilestone = () => {
      const removeIndex = currentTaskContract.contract.milestones.findIndex(({ id }) => milestone.id === id)

      if (removeIndex !== -1) currentTaskContract.contract.milestones.splice(removeIndex, 1)
    }

    isReleasingMilestone.value = true
    releaseMilestoneMoney(currentContractId, milestone.id)
      .then((response) => {
        const updatedTaskContract: ContractWithTask = {
          ...currentTaskContract,
          contract: response.data,
        }
        setMarketerTaskContract(updatedTaskContract)
        addToast('Milestone released', 'success')
      })
      .catch((e: AxiosError) => {
        const error = getFirstError<MilestoneReleaseError>(e)
        let errorMessage = errorMessagesToString(e)
        try {
          if (error?.errorType === MilestoneReleaseError.CONTRACT_NOT_BELONG_TO_USER) {
            errorMessage = 'This contract does not belong to you'
            return router.push({ name: 'Dashboard' })
          }
          if (error?.errorType === MilestoneReleaseError.CONTRACT_NOT_EXIST) {
            errorMessage = 'This contract does not exists'
            return router.push({ name: 'Dashboard' })
          }
          if (error?.errorType === MilestoneReleaseError.MILESTONE_NOT_EXIST) {
            errorMessage = 'This milestone does not exists'
            removeMilestone()
          }
          if (error?.errorType === MilestoneReleaseError.UNABLE_TO_MODIFY_ENDED_CONTRACT) {
            errorMessage = "You can't modify contract that has been ended already"
            currentTaskContract.contract.ended = true
          }
          if (error?.errorType === MilestoneReleaseError.UNABLE_TO_RELEASE_MILESTONE) {
            errorMessage = 'Unable to release milestone'
          }
        } finally {
          addToast(errorMessage || 'Unexpected error occurred during securing milestone', 'danger')
        }
      })
      .finally(() => {
        isReleasingMilestone.value = false
      })
  }

  const doDeleteMilestone = (milestone: ContractMilestonePublicInfo) => {
    if (!getMarketerTaskContract.value) return
    const currentContractId = getMarketerTaskContract.value?.contract.id || contractId.value
    const currentTaskContract = getMarketerTaskContract.value

    const removeMilestone = () => {
      const removeIndex = currentTaskContract.contract.milestones.findIndex(({ id }) => milestone.id === id)

      if (removeIndex !== -1) currentTaskContract.contract.milestones.splice(removeIndex, 1)
    }

    isDeletingMilestone.value = true
    deleteMilestone(currentContractId, milestone.id)
      .then(() => {
        removeMilestone()
      })
      .catch((e: AxiosError) => {
        const error = getFirstError<MilestoneDeleteError>(e)
        let errorMessage = errorMessagesToString(e)
        try {
          if (error?.errorType === MilestoneDeleteError.CONTRACT_NOT_BELONG_TO_USER) {
            errorMessage = 'This contract does not belong to you'
            return router.push({ name: 'Dashboard' })
          }
          if (error?.errorType === MilestoneDeleteError.CONTRACT_NOT_EXIST) {
            errorMessage = 'This contract does not exists'
            return router.push({ name: 'Dashboard' })
          }
          if (error?.errorType === MilestoneDeleteError.MILESTONE_NOT_EXIST) {
            errorMessage = 'This milestone does not exists'
            removeMilestone()
          }
          if (error?.errorType === MilestoneDeleteError.UNABLE_TO_MODIFY_ENDED_CONTRACT) {
            errorMessage = "You can't modify contract that has been ended already"
            currentTaskContract.contract.ended = true
          }
          if (error?.errorType === MilestoneDeleteError.UNABLE_TO_RELEASE_MILESTONE) {
            errorMessage = 'Unable to release milestone'
          }
        } finally {
          addToast(errorMessage || 'Unexpected error occurred during deleting milestone', 'danger')
        }
      })
      .finally(() => {
        isDeletingMilestone.value = false
      })
  }

  const doOpenDispute = (milestone: ContractMilestonePublicInfo) => {
    if (milestone.disputeId != null && milestone.disputeChatId != null) {
      router.push({ name: 'SelectedChat', params: { chatId: milestone.disputeChatId } })
    } else {
      isOpeningDispute.value = true

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
            addToast('This page needs reload. It reloads automatically after a second', 'danger')
            setTimeout(() => {
              window.location.reload()
            }, 1000)
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
  }

  const doEndContract = async () => {
    const marketerTaskContract = getMarketerTaskContract.value
    if (!marketerTaskContract) return

    isEndingContract.value = true
    return await endContract(contractId.value)
      .then((response) => {
        const updatedTaskContract = {
          ...marketerTaskContract,
          contract: response.data,
        }
        setMarketerTaskContract(updatedTaskContract)
      })
      .catch((e: AxiosError) => {
        const error = getFirstError<ContractEndErrors>(e)
        let errorMessage = errorMessagesToString(e)
        try {
          if (error?.errorType === ContractEndErrors.CONTRACT_NOT_BELONG_TO_USER) {
            errorMessage = 'This contract does not belong to you'
            return router.push({ name: 'Dashboard' })
          }
          if (error?.errorType === ContractEndErrors.CONTRACT_NOT_EXIST) {
            errorMessage = 'This contract does not exists'
            return router.push({ name: 'Dashboard' })
          }
          if (error?.errorType === ContractEndErrors.UNABLE_TO_END_CONTRACT_WITH_SECURED_MILESTONES) {
            errorMessage = 'Unable to end contract with secured milestones'
          }
          if (error?.errorType === ContractEndErrors.UNABLE_TO_END_NOT_ACCEPTED_CONTRACT) {
            errorMessage = 'Unable end not accepted contract'
            marketerTaskContract.contract.accepted = false
          }
        } finally {
          addToast(errorMessage || 'Unexpected error occurred during deleting milestone', 'danger')
        }
      })
      .finally(() => {
        isEndingContract.value = false
      })
  }

  const hasSecuredMilestones = computed(() => {
    const milestones = getMarketerTaskContract.value?.contract.milestones || []

    return milestones.some((milestone) => milestone.state === MilestoneState.SECURED)
  })

  return {
    isShowLeaveReview,
    hasSecuredMilestones,
    getMarketerTaskContract,
    isExecutingAction,
    isLoading,
    isLoaded,
    isError,
    initTaskContract,
    secureMilestone,
    releaseMilestone,
    doDeleteMilestone,
    doEndContract,
    goToChat,
    doOpenDispute,
  }
}
