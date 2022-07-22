import { createFormArray, createFormFieldSet, createFormItem, useValidators } from '@/components/helpers/forms'
import { useStringPathParamReactive } from '@/components/helpers/route'
import { extractEntitiesLoadingState } from '@/components/helpers/state'
import useProposalController from '@/middleware/controllers/useProposalController'
import useReviewController from '@/middleware/controllers/useReviewController'
import { getFirstError } from '@/services/api'
import useMarketerTaskContractStore from '@/store/marketer-task-contract'
import useToastsStore from '@/store/toasts'
import { ContractWithTask } from '@/types/contract.model'
import { SocialAccountsForProposal } from '@/types/platform.model'
import {
  AddInfluencerReviewError,
  ReviewToAddForInfluencer,
  SocialMediaAccountRatings,
  SocialMediaRatings,
} from '@/types/review.model'
import { AxiosError } from 'axios'
import { computed, ref, watch, toRefs } from 'vue'
import { useRouter } from 'vue-router'

export default function useInfluencerReviewPopup() {
  const { stringMaxLength, numberMinValue } = useValidators()
  const { fetchProposalById } = useProposalController()
  const contractId = useStringPathParamReactive('contractId')
  const {
    marketerTaskProposal,
    getMarketerTaskContract,
    proposalLoadingState,
    setMarketerProposal,
    setMarketerProposalState,
  } = useMarketerTaskContractStore()
  const { addInfluencerReview } = useReviewController()
  const { addToast } = useToastsStore()

  const { isLoading, isLoaded, isError } = extractEntitiesLoadingState(proposalLoadingState)

  const router = useRouter()
  const isWaitingResponse = ref(false)
  const isStepOne = ref(true)
  const isStepTwo = ref(false)

  const hasSocialMediaAccountsAttached = computed(() => {
    const accounts = marketerTaskProposal.value?.accounts || ({} as SocialAccountsForProposal)
    let key: keyof typeof accounts
    for (key in accounts) {
      if (accounts[key].length) return true
    }
    return false
  })

  const createSocialItemsForm = () => {
    const instagram = marketerTaskProposal.value?.accounts.instagram.map((account) => {
      const isSelected = createFormItem(true)
      const requiredIfSelected = (value: number | string | unknown) => {
        if (!value && value !== 0 && value !== false && isSelected.value) return 'Field is required'
        return true
      }

      return createFormFieldSet({
        isSelected,
        id: createFormItem(account.id),
        username: createFormItem(account.username),
        tags: createFormItem(account.tags),
        rating: createFormItem<number>(undefined, { validators: [requiredIfSelected] }),
      })
    })

    const youtube = marketerTaskProposal.value?.accounts.youtube.map((account) => {
      const isSelected = createFormItem(true)
      const requiredIfSelected = (value: number | string | unknown) => {
        if (!value && value !== 0 && value !== false && isSelected.value) return 'Field is required'
        return true
      }

      return createFormFieldSet({
        isSelected,
        id: createFormItem(account.id),
        username: createFormItem(account.username),
        tags: createFormItem(account.tags),
        rating: createFormItem<number>(undefined, { validators: [requiredIfSelected] }),
      })
    })

    const twitch = marketerTaskProposal.value?.accounts.twitch.map((account) => {
      const isSelected = createFormItem(true)
      const requiredIfSelected = (value: number | string | unknown) => {
        if (!value && value !== 0 && value !== false && isSelected.value) return 'Field is required'
        return true
      }

      return createFormFieldSet({
        isSelected,
        id: createFormItem(account.id),
        username: createFormItem(account.username),
        tags: createFormItem(account.tags),
        rating: createFormItem<number>(undefined, { validators: [requiredIfSelected] }),
      })
    })

    const tiktok = marketerTaskProposal.value?.accounts.tiktok.map((account) => {
      const isSelected = createFormItem(true)
      const requiredIfSelected = (value: number | string | unknown) => {
        if (!value && value !== 0 && value !== false && isSelected.value) return 'Field is required'
        return true
      }

      return createFormFieldSet({
        isSelected,
        id: createFormItem(account.id),
        username: createFormItem(account.username),
        tags: createFormItem(account.tags),
        rating: createFormItem<number>(undefined, { validators: [requiredIfSelected] }),
      })
    })

    return createFormFieldSet({
      instagram: createFormArray(instagram || []),
      youtube: createFormArray(youtube || []),
      twitch: createFormArray(twitch || []),
      tiktok: createFormArray(tiktok || []),
    })
  }

  const createInfluencerReviewForm = () => {
    const description = createFormItem('', {
      validators: [stringMaxLength(1000, () => 'Description must consist at at most 1000 symbols')],
    })
    const accounts = createSocialItemsForm()

    const userRating = createFormItem<number>(0, { validators: [numberMinValue(1, () => 'Field is required')] })

    return createFormFieldSet({
      description,
      userRating,
      accounts,
    })
  }

  const influencerReviewForm = createInfluencerReviewForm()

  const hasSelectedSocialAccounts = computed(() => {
    const { instagram, twitch, youtube } = toRefs(influencerReviewForm.fieldSet.accounts.fieldSet)

    const isInstagramSelected = instagram.value.fieldSets.some((account) => account.fieldSet.isSelected.value)
    const isYoutubeSelected = youtube.value.fieldSets.some((account) => account.fieldSet.isSelected.value)
    const isTwitchSelected = twitch.value.fieldSets.some((account) => account.fieldSet.isSelected.value)

    return isInstagramSelected || isYoutubeSelected || isTwitchSelected
  })

  const fetchProposal = (proposalId: string) => {
    if (marketerTaskProposal.value?.id !== proposalId) {
      setMarketerProposal(undefined)
    }
    if (!marketerTaskProposal.value) {
      setMarketerProposalState('loading')
      fetchProposalById(proposalId)
        .then((response) => {
          setMarketerProposalState('loaded')
          setMarketerProposal(response.data)
          influencerReviewForm.fieldSet.accounts = createSocialItemsForm()
        })
        .catch(() => {
          setMarketerProposalState('error')
        })
    }
  }

  const tryFetchProposal = (taskContract?: ContractWithTask) => {
    if (!taskContract?.proposalId) return
    fetchProposal(taskContract.proposalId)
  }

  const observeContractChanges = () => {
    watch(() => getMarketerTaskContract.value, tryFetchProposal, { immediate: true })
  }

  const closePopup = () => {
    router.push({ name: 'MarketerTaskSingleContract' })
  }

  const extractFormValue = (): ReviewToAddForInfluencer => {
    const formValue = influencerReviewForm.getValue()
    let key: keyof typeof formValue.accounts
    let ratingSum = 0
    let ratingCount = 0
    for (key in formValue.accounts) {
      formValue.accounts[key].forEach((account) => {
        ratingSum += account.rating
        ratingCount += 1
      })
    }
    const socialAccountRatings: SocialMediaAccountRatings = {}
    if (ratingCount !== 0 && hasSelectedSocialAccounts.value) {
      const averageRating = ratingSum / ratingCount || 0
      formValue.userRating = averageRating
      socialAccountRatings['YOUTUBE'] = formValue.accounts.youtube.reduce((acc, val) => {
        if (val.isSelected) {
          acc[val.id] = val.rating
        }
        return acc
      }, {} as SocialMediaRatings)
      socialAccountRatings['INSTAGRAM'] = formValue.accounts.instagram.reduce((acc, val) => {
        if (val.isSelected) {
          acc[val.id] = val.rating
        }
        return acc
      }, {} as SocialMediaRatings)
      socialAccountRatings['TWITCH'] = formValue.accounts.twitch.reduce((acc, val) => {
        if (val.isSelected) {
          acc[val.id] = val.rating
        }
        return acc
      }, {} as SocialMediaRatings)
      influencerReviewForm.fieldSet.userRating.setValue(formValue.userRating)
    }

    return {
      description: formValue.description,
      userRating: formValue.userRating,
      socialAccountRatings,
    }
  }

  const submitForm = () => {
    const formValue = extractFormValue()
    const isValid = influencerReviewForm.validate()
    if (!isValid) return

    isWaitingResponse.value = true

    addInfluencerReview(contractId.value, formValue)
      .then(() => {
        addToast('Review has been successfully sent', 'success')
        if (getMarketerTaskContract.value?.contract) {
          getMarketerTaskContract.value.contract.influencerReviewed = true
        }
        router.push({ name: 'MarketerTaskSingleContract' })
      })
      .catch((e: AxiosError) => {
        const error = getFirstError<AddInfluencerReviewError>(e)
        if (error?.errorType === AddInfluencerReviewError.CONTRACT_ALREADY_REVIEWED) {
          addToast('Contract is reviewed already', 'danger')
        }
        if (error?.errorType === AddInfluencerReviewError.CONTRACT_NOT_BELONG_TO_USER) {
          addToast('Contract is not belong to you', 'danger')
        }
        if (error?.errorType === AddInfluencerReviewError.CONTRACT_NOT_ENDED) {
          addToast('Contract has not been ended', 'danger')
        }
        if (error?.errorType === AddInfluencerReviewError.CONTRACT_NOT_EXIST) {
          addToast('Contract does not exist', 'danger')
        }
        if (error?.errorType === AddInfluencerReviewError.SOCIAL_ACCOUNT_NOT_EXIST) {
          addToast('Social accounts does not exist', 'danger')
        }
      })
      .finally(() => {
        isWaitingResponse.value = false
      })
  }

  const submitFirstStep = () => {
    if (hasSocialMediaAccountsAttached.value) {
      isStepOne.value = false
      isStepTwo.value = true
    }
  }

  const goBackToStepOne = () => {
    isStepOne.value = true
    isStepTwo.value = false
  }

  return {
    marketerTaskProposal,
    hasSocialMediaAccountsAttached,
    hasSelectedSocialAccounts,
    isLoading,
    isLoaded,
    isError,
    isStepOne,
    isStepTwo,
    isWaitingResponse,
    influencerReviewForm,
    closePopup,
    createInfluencerReviewForm,
    observeContractChanges,
    tryFetchProposal,
    submitFirstStep,
    submitForm,
    goBackToStepOne,
  }
}
