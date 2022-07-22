import { ref } from 'vue'
import { getStripe } from '@/services/stripe'
import type { Stripe, StripeElements } from '@stripe/stripe-js'
import { createFormFieldSet, createFormItem, useValidators } from '@/components/helpers/forms'
import { Currency } from '@/types/money.model'
import useTransactionsController from '@/middleware/controllers/useTransactionsController'
import { StripePaymentIntentPublicInfo } from '@/types/transaction.model'
import useToastsStore from '@/store/toasts'

export default function useDepositFundPopup() {
  const isStripeLoading = ref(false)
  const isStripeLoadingError = ref(false)

  const isLoadingPaymentIntent = ref(false)
  const isCreatingPaymentIntentError = ref(false)

  const paymentElementId = 'payment-element'

  const isFirstStep = ref(true)
  const isSecondStep = ref(false)

  const isConfirmingPayment = ref(false)

  const { numberMinValue, numberMaxValue } = useValidators()
  const { createPaymentIntent } = useTransactionsController()
  const { addToast } = useToastsStore()

  let stripe: Stripe | null = null
  let stripeElements: StripeElements | null = null

  const initStripe = async () => {
    isStripeLoading.value = true
    stripe = await getStripe().catch(() => {
      isStripeLoadingError.value = true
      return null
    })
    isStripeLoading.value = false
  }

  const createDepositForm = () => {
    // these a boundaries are set from stripe requirements
    const stripeMinValue = 2
    const stripeMaxValue = 99999.99

    const value = createFormItem(0, {
      validators: [
        numberMinValue(stripeMinValue, () => 'Deposit sum must be greater or equal to 2 USD'),
        numberMaxValue(stripeMaxValue, () => 'Deposit sum must be less or equal to 99999.99 USD'),
      ],
    })
    const currency = createFormItem<Currency>(Currency.USD)

    return createFormFieldSet({
      value,
      currency,
    })
  }

  const depositForm = createDepositForm()

  const mountElements = (paymentIntent?: StripePaymentIntentPublicInfo) => {
    stripeElements = stripe?.elements({ clientSecret: paymentIntent?.clientSecret }) || null

    const stripeCard = stripeElements?.create('payment')

    stripeCard?.mount('#' + paymentElementId)
  }

  const sendDepositPaymentIntent = () => {
    const isFormValid = depositForm.validate()
    if (!isFormValid) return

    const formValue = depositForm.getValue()
    depositForm.setDisabledState()

    const formValueFormatted = {
      ...formValue,
      currency: formValue.currency as Currency,
    }

    isLoadingPaymentIntent.value = true
    createPaymentIntent(formValueFormatted)
      .then((response) => {
        setTimeout(() => mountElements(response.data))
        isFirstStep.value = false
        isSecondStep.value = true
      })
      .catch(() => {
        isCreatingPaymentIntentError.value = true
      })
      .finally(() => {
        isLoadingPaymentIntent.value = false
      })
  }

  const depositMoney = async () => {
    if (!stripeElements) return

    isConfirmingPayment.value = true

    try {
      if (!stripeElements) {
        throw new Error('Unexpected error occurred')
      }
      const stripeResponse = await stripe?.confirmPayment({
        elements: stripeElements,
        redirect: 'if_required',
      })
      const { error } = stripeResponse || {}

      isConfirmingPayment.value = false

      if (error?.type === 'card_error') {
        addToast(error.message || 'Unexpected error occurred when confirming payment', 'danger')
      } else if (error) {
        addToast('An unexpected error occurred,  when confirming payment', 'danger')
      }
    } catch (e) {
      isConfirmingPayment.value = false
      let errorMessage = 'Unexpected error occurred'
      const errorTyped = e as Record<string, unknown>
      if (typeof errorTyped.message === 'string') {
        errorMessage = errorTyped.message
      }
      addToast(errorMessage, 'danger')
      throw e
    }
  }

  return {
    initStripe,
    sendDepositPaymentIntent,
    depositMoney,
    isStripeLoading,
    isStripeLoadingError,
    isLoadingPaymentIntent,
    isCreatingPaymentIntentError,
    isConfirmingPayment,
    isFirstStep,
    isSecondStep,
    depositForm,
    paymentElementId,
  }
}
