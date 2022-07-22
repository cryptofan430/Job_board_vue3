import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { extractStates } from '@/components/helpers/api'
import { createFormArray, createFormFieldSet, createFormItem, useValidators } from '@/components/helpers/forms'
import { ContractToCreate } from '@/types/contract.model'
import { AxiosError } from 'axios'
import { errorMessagesToString } from '@/services/api'
import { MileStoneForm } from '@/types/forms.model'
import useMarketerCreateContractStore from '@/store/marketer-create-contract'
import useContractController from '@/middleware/controllers/useContractController'
import useTaskController from '@/middleware/controllers/useTaskController'
import useToastsStore from '@/store/toasts'
import useProposalController from '@/middleware/controllers/useProposalController'

export default function useMarketerCreateContract() {
  const router = useRouter()
  const { addContract } = useContractController()
  const { fetchTaskById } = useTaskController()
  const { fetchProposalById } = useProposalController()
  const { addToast } = useToastsStore()
  const {
    marketerCreateContractState,
    getActiveMarketerProposal,
    getWaitingActionResponse,
    getActiveMarketerTask,
    setActiveMarketerTask,
    setWaitingActionResponse,
    setActiveMarketerProposal,
    setCreateMarketerContractState,
    reset,
  } = useMarketerCreateContractStore()

  const { isLoading, isError, isLoaded } = extractStates(marketerCreateContractState)
  const { required, arrayMinLength, numberMinValue } = useValidators()

  const routeProposalId = useRoute().params.proposalId?.toString() || ''
  const taskId = useRoute().params.taskId?.toString() || ''

  const createMilestoneFieldSet = () => {
    const id = createFormItem(Math.random() + Date.now())
    const title = createFormItem('', { validators: [required] })
    const budget = createFormItem<number>(undefined, {
      validators: [required, numberMinValue(1, () => 'Budget must be higher or equal to 1')],
    })
    const description = createFormItem('', { validators: [required] })

    const fieldSet = createFormFieldSet({
      id,
      title,
      budget,
      description,
    })

    return fieldSet
  }

  const createProposalsForm = () => {
    const milestonesLengthValidator = arrayMinLength(1, () => 'There should be at least 1 milestone')
    const milestones = createFormArray<MileStoneForm>([], {
      validators: [milestonesLengthValidator],
    })
    const proposalId = createFormItem(routeProposalId)

    const form = createFormFieldSet({
      proposalId,
      milestones,
    })

    return form
  }

  const contractForm = createProposalsForm()

  const addMilestone = () => {
    const fieldSet = createMilestoneFieldSet()
    contractForm.fieldSet.milestones.add(fieldSet)
  }

  const createContract = async () => {
    const contract = contractForm.getValue()

    const milestones = contract.milestones
    const milestonesWithoutId = milestones.map((milestone) => ({
      ...milestone,
      id: undefined,
    }))
    const contractToCreate: ContractToCreate = {
      ...contract,
      milestones: milestonesWithoutId,
    }

    return await addContract(contractToCreate)
  }

  const fetchData = async () => {
    if (taskId !== getActiveMarketerTask.value?.id) {
      setActiveMarketerTask(undefined)
    }
    if (routeProposalId !== getActiveMarketerProposal.value?.id) {
      setActiveMarketerProposal(undefined)
    }

    if (!getActiveMarketerTask.value || !getActiveMarketerProposal.value) {
      setCreateMarketerContractState('loading')
    }

    if (!getActiveMarketerProposal.value) {
      await fetchProposalById(routeProposalId)
        .then((response) => setActiveMarketerProposal(response.data))
        .catch((e) => setCreateMarketerContractState('error', { message: e?.message }))
    }

    if (!getActiveMarketerTask.value) {
      await fetchTaskById(taskId)
        .then((response) => setActiveMarketerTask(response.data))
        .catch((e) => setCreateMarketerContractState('error', { message: e?.message }))
    }

    const task = getActiveMarketerTask.value
    const proposal = getActiveMarketerProposal.value

    if (task && !task.addedByMe) return router.push('/')

    if (proposal?.contractId && task) {
      const contractId = proposal.contractId
      const taskId = task.id
      return router.push(`/m/tasks/${taskId}/contracts/${contractId}`)
    }

    if (!isError.value) setCreateMarketerContractState('loaded')
  }

  const submitCreateContractForm = async () => {
    const isFormValid = contractForm.validate()

    if (!isFormValid) return

    setWaitingActionResponse(true)

    return await createContract()
      .then((response) => router.push(`/m/tasks/${taskId}/contracts/${response.data.id}`))
      .catch((e: AxiosError) => {
        const errorMessage = errorMessagesToString(e)
        addToast(errorMessage, 'danger')
      })
      .finally(() => {
        setWaitingActionResponse(false)
      })
  }

  const totalBudget = computed(() => {
    const milestones = contractForm.fieldSet.milestones.fieldSets
    const milestoneBudgets = milestones.map((milestone) => milestone.fieldSet.budget.value).filter(Boolean)

    return milestoneBudgets.reduce((prev, milestoneBudget) => prev + Number(milestoneBudget) || 0, 0)
  })

  return {
    getActiveMarketerProposal,
    getWaitingActionResponse,
    getActiveMarketerTask,
    contractForm,
    totalBudget,
    isLoading,
    isError,
    isLoaded,
    reset,
    fetchData,
    addMilestone,
    submitCreateContractForm,
  }
}
