import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { ProposalToAdd } from '@/types/proposal.model'
import { SocialMediaAccountsResponse, AccountIdsGroupedByPlatform } from '@/types/platform.model'
import { TaskPublicInfo } from '@/types/tasks.model'

import useSocialAccountController from '@/middleware/controllers/useSocialAccountController'
import useProposalController from '@/middleware/controllers/useProposalController'
import useTaskController from '@/middleware/controllers/useTaskController'

import { useSubmitProposalDataValidation } from './submit-proposal-data.validation'
import { errorMessagesToString } from '@/services/api'
import { AxiosError } from 'axios'
import useTaskStore from '@/store/task'

const relevantAccounts = ref({} as SocialMediaAccountsResponse)
const relevantAccountsReady = ref(false)
const selectedRelevantAccounts = ref<AccountIdsGroupedByPlatform>({
  INSTAGRAM: [],
  YOUTUBE: [],
  TWITCH: [],
  TIKTOK: [],
})

const { addProposal } = useProposalController()

const task = ref<TaskPublicInfo | null>(null)
const taskReady = ref(false)

const redirectUrl = ref('')

const taskRequestFailed = ref(false)
const socialRequestFailed = ref(false)

const setTask = (taskData: TaskPublicInfo) => {
  task.value = taskData
  taskReady.value = true
}

const proposalData = ref<ProposalToAdd>({
  taskId: '',
  cost: 0,
  description: '',
  accountsIdsGroupedByPlatform: {},
})

const waitingForResponse = ref(false)
const responseErrorMessage = ref('')
const clearResponseErrorMessage = () => (responseErrorMessage.value = '')
const clearProposalData = () => {
  proposalData.value.taskId = ''
  proposalData.value.cost = 0
  proposalData.value.description = ''
  proposalData.value.accountsIdsGroupedByPlatform = {}
  task.value = null
  taskReady.value = false
  taskRequestFailed.value = false
  socialRequestFailed.value = false
  redirectUrl.value = ''
}

export default function useSubmitProposal() {
  const { fetchMySocialAccountsToProposeToTask } = useSocialAccountController()

  const { fetchTask } = useTaskController()
  const { setSelectedTask } = useTaskStore()

  const submitProposalDataValidation = useSubmitProposalDataValidation()
  const noRelevantAccounts = computed(() => {
    let key: keyof SocialMediaAccountsResponse
    for (key in relevantAccounts.value) {
      if (relevantAccounts.value[key]?.length) return false
    }
    return true
  })

  const route = useRoute()
  const router = useRouter()
  const taskID = route.params.taskId as string

  const redirectToTask = (taskID: string) => {
    router.push(`/i/tasks/${taskID}/proposal`)
  }

  const redirectToMarketerTask = (taskId: string) => {
    router.push({
      name: 'MarketerTaskDetails',
      params: {
        taskId,
      },
    })
  }

  const getTask = () => {
    if (!taskReady.value) {
      taskRequestFailed.value = false
      fetchTask(taskID)
        .then((response) => {
          const taskResponse = response.data
          if (taskResponse.addedByMe) {
            setSelectedTask(taskResponse)
            return redirectToMarketerTask(taskID)
          }
          proposalData.value.cost = taskResponse.budget.value
          task.value = taskResponse
        })
        .then(() => {
          taskReady.value = true
        })
        .catch(() => {
          taskRequestFailed.value = true
        })
    }
  }

  const getSocial = () => {
    socialRequestFailed.value = false
    fetchMySocialAccountsToProposeToTask(taskID)
      .then((response) => {
        relevantAccounts.value = response?.data
      })
      .then(() => {
        relevantAccountsReady.value = true
      })
      .catch(() => {
        socialRequestFailed.value = true
      })
  }

  const submit = () => {
    proposalData.value.accountsIdsGroupedByPlatform = selectedRelevantAccounts.value
    proposalData.value.taskId = taskID

    if (submitProposalDataValidation.validation(proposalData.value)) {
      waitingForResponse.value = true
      addProposal(proposalData.value)
        .then(() => {
          waitingForResponse.value = false
          redirectToTask(proposalData.value.taskId)
        })
        .catch((error: AxiosError) => {
          if (error?.response?.data?.errors?.[0]?.errorType === 'PROPOSAL_ALREADY_SUBMITTED') {
            redirectUrl.value = `/i/tasks/${proposalData.value.taskId}/proposal`
          }

          responseErrorMessage.value = errorMessagesToString(error)
          waitingForResponse.value = false
        })
    }
  }

  return {
    proposalData,
    submit,
    errors: submitProposalDataValidation.errors,
    waitingForResponse,
    clearResponseErrorMessage,
    task,
    getTask,
    getSocial,
    relevantAccounts,
    selectedRelevantAccounts,
    responseErrorMessage,
    redirectUrl,
    taskReady,
    relevantAccountsReady,
    taskRequestFailed,
    socialRequestFailed,
    setTask,
    redirectToTask,
    clearProposalData,
    noRelevantAccounts,
  }
}
