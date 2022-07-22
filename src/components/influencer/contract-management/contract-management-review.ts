import { createFormFieldSet, createFormItem, useValidators } from '@/components/helpers/forms'
import { useStringPathParamReactive } from '@/components/helpers/route'
import useReviewController from '@/middleware/controllers/useReviewController'
import { getFirstError } from '@/services/api'
import useInfluencerContractManagementStore from '@/store/influencer-contract-management'
import useToastsStore from '@/store/toasts'
import { AddMarketerReviewError } from '@/types/review.model'
import { AxiosError } from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default function useContractManagementReview() {
  const router = useRouter()
  const contractId = useStringPathParamReactive('contractId')
  const isWaitingResponse = ref(false)

  const { required, stringMaxLength } = useValidators()
  const { addMarketerReview } = useReviewController()
  const { addToast } = useToastsStore()
  const { getTaskContract } = useInfluencerContractManagementStore()

  const createContractManagementReviewForm = () => {
    const description = createFormItem('', {
      validators: [stringMaxLength(1000, () => 'Description must consist at at most 1000 symbols')],
    })
    const userRating = createFormItem<number>(undefined, { validators: [required] })

    return createFormFieldSet({
      description,
      userRating,
    })
  }

  const contractManagementForm = createContractManagementReviewForm()

  const submitMarketerReview = () => {
    const isValid = contractManagementForm.validate()

    if (isValid && contractId.value) {
      isWaitingResponse.value = true
      const formValue = contractManagementForm.getValue()
      addMarketerReview(contractId.value, formValue)
        .then((response) => {
          router.push({ name: 'ContractManagement' })
          addToast('Review has been successfully sent', 'success')
          if (getTaskContract.value?.contract && getTaskContract.value.contract?.id === response.data.contractId) {
            getTaskContract.value.contract.marketerReviewed = true
          }
        })
        .catch((e: AxiosError) => {
          const error = getFirstError<AddMarketerReviewError>(e)
          if (error?.errorType === AddMarketerReviewError.CONTRACT_ALREADY_REVIEWED) {
            addToast('Contract is reviewed already', 'danger')
          }
          if (error?.errorType === AddMarketerReviewError.CONTRACT_NOT_BELONG_TO_USER) {
            addToast('Contract is not belong to you', 'danger')
          }
          if (error?.errorType === AddMarketerReviewError.CONTRACT_NOT_ENDED) {
            addToast('Contract has not been ended', 'danger')
          }
          if (error?.errorType === AddMarketerReviewError.CONTRACT_NOT_EXIST) {
            addToast('Contract does not exist', 'danger')
          }
        })
        .finally(() => {
          isWaitingResponse.value = false
        })
    }
  }

  const closePopup = () => {
    router.push({ name: 'ContractManagement' })
  }

  return {
    isWaitingResponse,
    contractManagementForm,
    submitMarketerReview,
    closePopup,
  }
}
