import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createFormArray, createFormFieldSet, createFormItem, useValidators } from '@/components/helpers/forms'
import { MileStoneForm } from '@/types/forms.model'
import useMarketerAddMilestonesStore from '@/store/marketer-add-milestones'
import useContractController from '@/middleware/controllers/useContractController'
import useMarketerTaskContractStore from '@/store/marketer-task-contract'
import { errorMessagesToString, getFirstError } from '@/services/api'
import { AddMilestonesErrors } from '@/types/contract.model'
import useToastsStore from '@/store/toasts'
import { extractStates } from '@/components/helpers/api'

export default function useMarketerAddMilestones() {
  const router = useRouter()
  const { required, numberMinValue } = useValidators()
  const { addMilestones, fetchContractWithTask } = useContractController()
  const { addToast } = useToastsStore()
  const { setMarketerTaskContract } = useMarketerTaskContractStore()
  const {
    getActiveMarketerTaskContract,
    marketerAddMilestonesState,
    getWaitingActionResponse,
    setActiveMarketerTaskContract,
    setCreateMarketerContractState,
    setWaitingActionResponse,
  } = useMarketerAddMilestonesStore()
  const { isLoading, isError, isLoaded } = extractStates(marketerAddMilestonesState)

  const contractId = useRoute().params.contractId?.toString() || ''

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
    const milestones = createFormArray<MileStoneForm>([])

    const form = createFormFieldSet({
      milestones,
    })

    return form
  }

  const milestonesForm = createProposalsForm()

  const addMilestone = () => {
    const fieldSet = createMilestoneFieldSet()
    milestonesForm.fieldSet.milestones.add(fieldSet)
  }

  const doAddMilestones = async () => {
    const taskContract = getActiveMarketerTaskContract.value
    if (!taskContract) return

    const value = milestonesForm.getValue()
    const validMilestones = value.milestones.map((milestone) => ({
      ...milestone,
      id: undefined,
    }))
    const milestonesData = {
      milestones: validMilestones,
    }

    return await addMilestones(contractId, milestonesData)
      .then((response) => {
        const updatedTaskContract = {
          ...taskContract,
          contract: response.data,
        }
        setMarketerTaskContract(updatedTaskContract)
        setActiveMarketerTaskContract(updatedTaskContract)
        router.push({ name: 'MarketerTaskSingleContract' })
      })
      .catch((e) => {
        let errorMessage = errorMessagesToString(e)
        const error = getFirstError<AddMilestonesErrors>(e)

        try {
          if (error?.errorType === AddMilestonesErrors.CONTRACT_NOT_BELONG_TO_USER) {
            router.push({ name: 'Dashboard' })
            errorMessage = 'This contract does not belong to you'
          }
          if (error?.errorType === AddMilestonesErrors.CONTRACT_NOT_EXIST) {
            router.push({ name: 'Dashboard' })
            errorMessage = 'This contract does not exist anymore'
          }
          if (error?.errorType === AddMilestonesErrors.UNABLE_TO_MODIFY_ENDED_CONTRACT) {
            router.push({ name: 'MarketerTaskSingleContract' })
            errorMessage = "You can't modify ended contract"
          }
        } finally {
          addToast(errorMessage, 'danger')
        }
      })
  }

  const submitAddMilestonesForm = () => {
    const isValid = milestonesForm.validate()
    if (!isValid) return

    setWaitingActionResponse(true)
    doAddMilestones().finally(() => {
      setWaitingActionResponse(false)
    })
  }

  const totalBudget = computed(() => {
    const initialMilestones = computed(() => getActiveMarketerTaskContract.value?.contract?.milestones || [])
    const initialMilestonesBudgets = computed(() => initialMilestones.value.map((milestone) => milestone.budget.value))
    const initialMilestonesBudget = computed(() =>
      initialMilestonesBudgets.value.reduce((prev, milestoneBudget) => prev + milestoneBudget, 0)
    )

    const milestones = milestonesForm.fieldSet.milestones.fieldSets
    const milestoneBudgets = milestones.map((milestone) => milestone.fieldSet.budget.value).filter(Boolean)

    return (
      milestoneBudgets.reduce((prev, milestoneBudget) => prev + Number(milestoneBudget) || 0, 0) +
      initialMilestonesBudget.value
    )
  })

  const fetchData = async () => {
    if (contractId !== getActiveMarketerTaskContract.value?.contract.id) {
      setActiveMarketerTaskContract(undefined)
    }

    if (!getActiveMarketerTaskContract.value || !getActiveMarketerTaskContract.value) {
      setCreateMarketerContractState('loading')
    }

    if (!getActiveMarketerTaskContract.value) {
      await fetchContractWithTask(contractId)
        .then((response) => {
          setCreateMarketerContractState('loaded')
          setActiveMarketerTaskContract(response.data)
        })
        .catch(() => setCreateMarketerContractState('error'))
    }
  }

  return {
    isLoading,
    isLoaded,
    isError,
    getActiveMarketerTaskContract,
    getWaitingActionResponse,
    milestonesForm,
    totalBudget,
    addMilestone,
    submitAddMilestonesForm,
    fetchData,
  }
}
