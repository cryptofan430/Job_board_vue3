import { ref } from 'vue'
import { AxiosError } from 'axios'
import { useDepositFundsValidation } from './deposit-funds-validation'
import { Currency } from '@/types/money.model'
import { errorMessagesToString } from '@/services/api'

import useUserManagementController from '@/middleware/controllers/useUserManagementController'
import useUserStore from '@/store/user'

const requestFailed = ref(false)
const waitingForResponse = ref(false)
const responseErrorMessage = ref('')
const isPopupChooseBillingMethodVisible = ref(false)

const depositFundsData = ref({
  value: '',
  currency: Currency.USD,
})

export default function useDepositFunds() {
  const { depositFunds } = useUserManagementController()
  const depositFundsValidation = useDepositFundsValidation()
  const { setMyProfile } = useUserStore()

  const togglePopupChooseBillingMethodVisibility = () => {
    isPopupChooseBillingMethodVisible.value = !isPopupChooseBillingMethodVisible.value
  }

  const resetData = () => (depositFundsData.value.value = '')

  const resetRequestFailed = () => (requestFailed.value = false)

  const update = () => {
    const data = {
      value: Number(depositFundsData.value.value),
      currency: depositFundsData.value.currency,
    }

    if (depositFundsValidation.validation(data)) {
      waitingForResponse.value = true

      depositFunds(data)
        .then((response) => {
          setMyProfile(response.data)
          resetData()
          waitingForResponse.value = false
          togglePopupChooseBillingMethodVisibility()
        })
        .catch((error: AxiosError) => {
          responseErrorMessage.value = errorMessagesToString(error)
          waitingForResponse.value = false
        })
    }
  }

  return {
    update,
    togglePopupChooseBillingMethodVisibility,
    errors: depositFundsValidation.errors,
    depositFundsData,
    waitingForResponse,
    responseErrorMessage,
    resetRequestFailed,
    isPopupChooseBillingMethodVisible,
  }
}
