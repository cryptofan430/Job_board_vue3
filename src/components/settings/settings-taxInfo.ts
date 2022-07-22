import { ref, watch } from '@vue/runtime-core'
import useUserManagementController from '@/middleware/controllers/useUserManagementController'
import { createFormFieldSet, createFormItem, useFormatters, useValidators } from '../helpers/forms'
import useUserStore from '@/store/user'
import useToastsStore from '@/store/toasts'

export default function useSettingsTaxInfo() {
  const { required } = useValidators()
  const { trimFormatter } = useFormatters()
  const { getMyProfile, setInfluencerInvoiceData, setMarketerInvoiceData } = useUserStore()
  const { addToast } = useToastsStore()
  const { updateMarketerTaxInfo, updateInfluencerTaxInfo } = useUserManagementController()

  const isInfluencerWaitingResponse = ref(false)
  const isMarketerWaitingResponse = ref(false)

  const createInfluencerForm = () => {
    const userProfile = getMyProfile.value
    const country = createFormItem(userProfile?.influencerInvoiceDetails.country || '', {
      validators: [],
      formatters: [trimFormatter],
    })

    const streetAddress = createFormItem(userProfile?.influencerInvoiceDetails.streetAddress || '', {
      validators: [required],
      formatters: [trimFormatter],
    })

    const city = createFormItem(userProfile?.influencerInvoiceDetails.city || '', {
      validators: [required],
      formatters: [trimFormatter],
    })

    const zipCode = createFormItem(userProfile?.influencerInvoiceDetails.zipCode || '', {
      validators: [required],
      formatters: [trimFormatter],
    })

    const vatId = createFormItem(userProfile?.influencerInvoiceDetails.vatId || '', {
      validators: [required],
      formatters: [trimFormatter],
    })

    const name = createFormItem(userProfile?.influencerInvoiceDetails.name || '', {
      validators: [required],
      formatters: [trimFormatter],
    })

    watch(getMyProfile, (userProfile) => {
      country.setValue(userProfile?.influencerInvoiceDetails.country || '')
      streetAddress.setValue(userProfile?.influencerInvoiceDetails.streetAddress || '')
      city.setValue(userProfile?.influencerInvoiceDetails.city || '')
      zipCode.setValue(userProfile?.influencerInvoiceDetails?.zipCode || '')
      vatId.setValue(userProfile?.influencerInvoiceDetails?.vatId || '')
      if (getMyProfile.value?.influencerInvoiceDetails && userProfile?.influencerInvoiceDetails) {
        getMyProfile.value.influencerInvoiceDetails = userProfile?.influencerInvoiceDetails
      }
    })

    return createFormFieldSet({
      country,
      streetAddress,
      city,
      zipCode,
      vatId,
      name,
    })
  }

  const createMarketerForm = () => {
    const userProfile = getMyProfile.value
    const country = createFormItem(userProfile?.marketerInvoiceDetails.country || '', {
      validators: [],
      formatters: [trimFormatter],
    })

    const streetAddress = createFormItem(userProfile?.marketerInvoiceDetails.streetAddress || '', {
      validators: [required],
      formatters: [trimFormatter],
    })

    const city = createFormItem(userProfile?.marketerInvoiceDetails.city || '', {
      validators: [required],
      formatters: [trimFormatter],
    })

    const zipCode = createFormItem(userProfile?.marketerInvoiceDetails.zipCode || '', {
      validators: [required],
      formatters: [trimFormatter],
    })

    const vatId = createFormItem(userProfile?.marketerInvoiceDetails.vatId || '', {
      validators: [required],
      formatters: [trimFormatter],
    })

    const name = createFormItem(userProfile?.marketerInvoiceDetails.name || '', {
      validators: [required],
      formatters: [trimFormatter],
    })

    watch(getMyProfile, (userProfile) => {
      country.setValue(userProfile?.marketerInvoiceDetails.country || '')
      streetAddress.setValue(userProfile?.marketerInvoiceDetails.streetAddress || '')
      city.setValue(userProfile?.marketerInvoiceDetails.city || '')
      zipCode.setValue(userProfile?.marketerInvoiceDetails?.zipCode || '')
      vatId.setValue(userProfile?.marketerInvoiceDetails?.vatId || '')
      if (getMyProfile.value?.marketerInvoiceDetails && userProfile?.marketerInvoiceDetails) {
        getMyProfile.value.marketerInvoiceDetails = userProfile?.marketerInvoiceDetails
      }
    })

    return createFormFieldSet({
      country,
      streetAddress,
      city,
      zipCode,
      vatId,
      name,
    })
  }

  const influencerForm = createInfluencerForm()
  const marketerForm = createMarketerForm()

  const submitMarketerForm = async () => {
    const isValid = marketerForm.validate()
    if (!isValid) return

    isMarketerWaitingResponse.value = true
    const marketerTaxInfo = marketerForm.getValue()
    console.log(marketerTaxInfo)
    updateMarketerTaxInfo(marketerTaxInfo)
      .then((response) => {
        setMarketerInvoiceData(response.data)
        addToast('Marketer Tax Information has been successfully updated', 'success')
      })
      .catch(() => {
        marketerForm.setError('An unexpected error occurred, please try later')
      })
      .finally(() => {
        isMarketerWaitingResponse.value = false
      })
  }

  const submitInfluencerForm = async () => {
    const isValid = influencerForm.validate()
    if (!isValid) return

    isInfluencerWaitingResponse.value = true
    const influencerTaxInfo = influencerForm.getValue()
    console.log(influencerTaxInfo)
    updateInfluencerTaxInfo(influencerTaxInfo)
      .then((response) => {
        setInfluencerInvoiceData(response.data)
        addToast('Influencer Tax Information has been successfully updated', 'success')
      })
      .catch(() => {
        marketerForm.setError('An unexpected error occurred, please try later')
      })
      .finally(() => {
        isInfluencerWaitingResponse.value = false
      })
  }

  return {
    influencerForm,
    marketerForm,
    isInfluencerWaitingResponse,
    isMarketerWaitingResponse,
    submitMarketerForm,
    submitInfluencerForm,
  }
}
