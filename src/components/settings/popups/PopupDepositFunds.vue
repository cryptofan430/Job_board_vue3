<template>
  <div class="popup">
    <div class="popup-content">
      <AppBackButton button-text="Back" :back-route="{ name: $route.meta.backRoute }" class="popup-back-button" />
      <AppCloseButton class="popup-close-button" @click="onClose" />

      <div class="popup-box">
        <AppSkeleton v-if="isFirstStep && isStripeLoading"></AppSkeleton>
        <AppErrorBox v-else-if="isFirstStep && isStripeLoadingError" @clicked="initStripe"></AppErrorBox>
        <form v-else-if="isFirstStep" class="sum-wrapper" @submit.prevent="sendDepositPaymentIntent">
          <AppLabel>
            What sum do you want to deposit?
            <div class="budget-input-wrapper" data-currency="$">
              <AppInput
                v-model="value.value"
                class="popup-input"
                :decimals="2"
                type="number"
                :error="value.isError"
                :disabled="isLoadingPaymentIntent || isSecondStep"
              />
            </div>
          </AppLabel>
          <AppInputError v-if="value.isError" class="money-amount-error">{{ value.getErrorMessage }}</AppInputError>

          <p class="receive-money">You’ll receive: ${{ userMoneyAmount }}</p>
          <p class="payment-fees-label">The estimated payment, after service fees.</p>
          <AppButton
            type="submit"
            :disabled="isLoadingPaymentIntent"
            :is-loading="isLoadingPaymentIntent"
            class="submit-first-step-button action-button"
            >Next step</AppButton
          >
        </form>

        <div v-else-if="isSecondStep">
          <div class="payment-select">
            <div class="button-toggles">
              <button class="button-toggle">Add card details</button>
              <button class="button-toggle --active">Choose billing method</button>
            </div>

            <form class="payment-form">
              <span :id="paymentElementId" class="payment-form-container"></span>
            </form>
            <div class="saved-payment-methods">
              <AppLabel class="card-label">
                <AppCheckbox />
                <BillingCard
                  class="billing-method-card"
                  side="front"
                  name="Name Surname"
                  number="**** **** **** 1234"
                  expiration-date="DD/MM"
                />
              </AppLabel>
            </div>
          </div>

          <div class="actions-wrapper">
            <AppButton
              size="md"
              :disabled="isConfirmingPayment"
              :is-loading="isConfirmingPayment"
              class="action-button"
              @click="submitPaymentForm"
              >Deposit</AppButton
            >
          </div>
          <div class="or-payment-methods">
            <p class="or-text">or</p>
            <div class="saved-payment-methods-mobile">
              <BillingCard
                class="billing-method-card"
                side="front"
                name="Name Surname"
                number="**** **** **** 1234"
                expiration-date="DD/MM"
              />
            </div>
            <div class="actions-wrapper">
              <AppButton
                size="md"
                :disabled="isConfirmingPayment"
                :is-loading="isConfirmingPayment"
                class="action-button"
                >Deposit</AppButton
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue'
import AppCloseButton from '@/components/common/AppCloseButton.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppLabel from '@/components/common/AppLabel.vue'
import AppInputError from '@/components/common/AppInputError.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppBackButton from '@/components/common/AppBackButton.vue'
import AppCheckbox from '@/components/common/AppCheckbox.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import BillingCard from '@/components/cards/BillingCard.vue'
import useDepositFundPopup from '@/components/settings/popups/deposit-funds-pop-up'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'PopupDepositFund',
  components: {
    AppCloseButton,
    AppBackButton,
    AppButton,
    AppLabel,
    AppInput,
    BillingCard,
    AppCheckbox,
    AppInputError,
    AppSkeleton,
    AppErrorBox,
  },
  setup() {
    const {
      paymentElementId,
      isStripeLoading,
      isStripeLoadingError,
      isLoadingPaymentIntent,
      isCreatingPaymentIntentError,
      isConfirmingPayment,
      isFirstStep,
      isSecondStep,
      depositForm,
      initStripe,
      depositMoney,
      sendDepositPaymentIntent,
    } = useDepositFundPopup()

    const { value } = toRefs(depositForm.fieldSet)
    const userMoneyAmount = computed(() => {
      const amountToDeposit = (value.value.value || 0) - 0.5 - (2.9 * (value.value.value || 0)) / 100
      if (amountToDeposit < 0) return 0
      return amountToDeposit.toFixed(2)
    })

    initStripe()

    const router = useRouter()
    const route = useRoute()
    const onClose = () => {
      router.push({ name: route.meta.backRoute as string })
    }

    const submitPaymentForm = () => {
      depositMoney()
        .then(onClose)
        .catch(() => null)
    }

    return {
      depositForm,
      isFirstStep,
      isSecondStep,
      value,
      userMoneyAmount,
      sendDepositPaymentIntent,
      paymentElementId,
      isStripeLoading,
      isStripeLoadingError,
      isLoadingPaymentIntent,
      isCreatingPaymentIntentError,
      isConfirmingPayment,
      depositMoney,
      initStripe,
      submitPaymentForm,
      onClose,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/popups/PopupDepositFunds';
</style>
