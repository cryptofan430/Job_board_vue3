import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { ProposalPublicInfo, ProposalUpdateData } from '@/types/proposal.model'
import { SocialMediaAccountsResponse, AccountIdsGroupedByPlatform } from '@/types/platform.model'
import { TaskPublicInfo } from '@/types/tasks.model'

import useSocialAccountController from '@/middleware/controllers/useSocialAccountController'
import useProposalController from '@/middleware/controllers/useProposalController'
import useTaskController from '@/middleware/controllers/useTaskController'

import { useSubmitProposalDataValidation } from './submit-proposal-data.validation'
import { errorMessagesToString } from '@/services/api'
import { AxiosError } from 'axios'
import { EntitiesLoadingState } from '@/types/api.model'
import { extractStates } from '@/components/helpers/api'

const relevantAccounts = ref({} as SocialMediaAccountsResponse)
const relevantAccountsReady = ref(false)
const selectedRelevantAccounts = ref<AccountIdsGroupedByPlatform>({
  INSTAGRAM: [],
  YOUTUBE: [],
  TWITCH: [],
})

const { updateProposal, fetchMyProposalsForTask } = useProposalController()

const task = ref<TaskPublicInfo | null>(null)
const taskReady = ref(false)

const redirectUrl = ref('')

const taskRequestFailed = ref(false)
const socialRequestFailed = ref(false)

const setTask = (taskData: TaskPublicInfo) => {
  task.value = taskData
  taskReady.value = true
}

const proposalData = ref<ProposalUpdateData>({
  cost: 0,
  description: '',
  accountsIdsGroupedByPlatform: {},
  id: '',
})

const taskProposal = ref<ProposalPublicInfo | null>(null)
const taskProposalLoadingState = ref<EntitiesLoadingState>({
  state: 'loaded',
  payload: {
    message: undefined,
  },
})

const waitingForResponse = ref(false)
const responseErrorMessage = ref('')
const clearResponseErrorMessage = () => (responseErrorMessage.value = '')
const clearProposalData = () => {
  proposalData.value.cost = 0
  proposalData.value.description = ''
  proposalData.value.accountsIdsGroupedByPlatform = {}
  task.value = null
  taskReady.value = false
  taskRequestFailed.value = false
  socialRequestFailed.value = false
  redirectUrl.value = ''
  taskProposal.value = null
}

export default function useEditProposal() {
  const { fetchMySocialAccountsToProposeToTask } = useSocialAccountController()
  const { isError, isLoaded, isLoading } = extractStates(taskProposalLoadingState.value)

  const { fetchTask } = useTaskController()

  const submitProposalDataValidation = useSubmitProposalDataValidation()

  const route = useRoute()
  const router = useRouter()
  const taskID = route.params.taskId as string

  const noRelevantAccounts = computed(() => {
    let key: keyof SocialMediaAccountsResponse
    for (key in relevantAccounts.value) {
      if (relevantAccounts.value[key]?.length) return false
    }
    return true
  })

  const redirectToTask = (taskID: string) => {
    router.push(`/i/tasks/${taskID}/proposal`)
  }
  const getTask = () => {
    if (!taskReady.value) {
      taskRequestFailed.value = false
      fetchTask(taskID)
        .then((response) => {
          const taskResponse = response.data
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

  const fetchTaskProposal = () => {
    taskProposalLoadingState.value = { state: 'loading' }

    fetchMyProposalsForTask(taskID)
      .then((response) => {
        if (response.data.count === 0) {
          return router.push({
            name: 'ProposalSubmit',
            params: {
              taskId: taskID,
            },
          })
        }
        taskProposal.value = response.data.proposals[0]
        taskProposalLoadingState.value = { state: 'loaded' }
      })
      .catch((e: AxiosError) => {
        taskProposalLoadingState.value = { state: 'error', payload: { message: errorMessagesToString(e) } }
      })
  }

  const watchTaskProposalUpdates = () => {
    watch(
      () => taskProposal.value,
      (newValue) => {
        if (newValue && proposalData?.value.accountsIdsGroupedByPlatform) {
          proposalData.value.description = newValue.description
          proposalData.value.cost = newValue.cost.value
          proposalData.value.accountsIdsGroupedByPlatform.INSTAGRAM = newValue.accounts.instagram.map(
            (account) => account.id
          )
          proposalData.value.accountsIdsGroupedByPlatform.YOUTUBE = newValue.accounts.youtube.map(
            (account) => account.id
          )
          proposalData.value.accountsIdsGroupedByPlatform.TWITCH = newValue.accounts.twitch.map((account) => account.id)
          selectedRelevantAccounts.value = proposalData.value.accountsIdsGroupedByPlatform
        }

        if (!newValue) {
          clearProposalData()
        }
      }
    )
  }

  const getSocial = () => {
    socialRequestFailed.value = false
    fetchMySocialAccountsToProposeToTask(taskID)
      .then((response) => (relevantAccounts.value = response?.data))
      .then(() => {
        relevantAccountsReady.value = true
      })
      .catch(() => {
        socialRequestFailed.value = true
      })
  }

  const submit = () => {
    const relevantAccountIds = new Set<string>()
    let key: keyof SocialMediaAccountsResponse
    for (key in relevantAccounts.value) {
      relevantAccounts.value[key].forEach((item) => relevantAccountIds.add(item.id))
    }

    let selectedAccountKey: keyof typeof selectedRelevantAccounts.value
    for (selectedAccountKey in selectedRelevantAccounts.value) {
      selectedRelevantAccounts.value[selectedAccountKey] = selectedRelevantAccounts.value[selectedAccountKey]?.filter(
        (accountId) => relevantAccountIds.has(accountId)
      )
    }
    proposalData.value.accountsIdsGroupedByPlatform = selectedRelevantAccounts.value

    if (submitProposalDataValidation.validation(proposalData.value) && taskProposal.value?.id) {
      waitingForResponse.value = true
      const proposalUpdateData = { ...proposalData.value, id: taskProposal.value.id }
      updateProposal(proposalUpdateData)
        .then(() => {
          waitingForResponse.value = false
          redirectToTask(taskID)
        })
        .catch((error: AxiosError) => {
          responseErrorMessage.value = errorMessagesToString(error)
          waitingForResponse.value = false
        })
    }
  }

  return {
    isLoading,
    isError,
    isLoaded,
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
    watchTaskProposalUpdates,
    fetchTaskProposal,
    noRelevantAccounts,
  }
}
