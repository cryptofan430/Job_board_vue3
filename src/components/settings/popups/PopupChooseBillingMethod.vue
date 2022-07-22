<template>
  <div class="popup">
    <div class="popup-content">
      <AppCloseButton @click="togglePopupChooseBillingMethodVisibility" />

      <h3 class="popup-title">Please, choose billing method that you prefer to use.</h3>

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

      <AppLabel class="card-label">
        <AppCheckbox />
        <BillingCard
          class="billing-method-card"
          side="back"
          name="Name Surname"
          number="**** **** **** 1234"
          :money="300"
          expiration-date="DD/MM"
        />
      </AppLabel>

      <AppLabel class="deposit-label">
        What sum do you want to deposit?
        <div class="budget-input-wrapper" data-currency="$">
          <AppInput v-model="depositFundsData.value" type="number" :decimals="2" />
        </div>
        <AppInputError>
          {{ errors.value }}
        </AppInputError>
      </AppLabel>

      <AppButton :disabled="waitingForResponse" :is-loading="waitingForResponse" @click="update"> Submit </AppButton>
    </div>

    <AppRequestErrorPopup
      v-if="responseErrorMessage.length"
      :error-text="responseErrorMessage"
      @close="resetRequestFailed"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppCloseButton from '@/components/common/AppCloseButton.vue'
import AppButton from '@/components/common/AppButton.vue'
import BillingCard from '@/components/cards/BillingCard.vue'
import AppLabel from '@/components/common/AppLabel.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppCheckbox from '@/components/common/AppCheckbox.vue'
import AppInputError from '@/components/common/AppInputError.vue'
import useDepositFunds from '@/components/settings/billings/deposit-funds'
import AppRequestErrorPopup from '@/components/common/AppRequestErrorPopup.vue'

export default defineComponent({
  name: 'PopupChooseBillingMethod',
  components: {
    AppCloseButton,
    AppButton,
    AppLabel,
    AppInput,
    BillingCard,
    AppCheckbox,
    AppInputError,
    AppRequestErrorPopup,
  },
  setup() {
    const {
      depositFundsData,
      update,
      waitingForResponse,
      errors,
      resetRequestFailed,
      responseErrorMessage,
      togglePopupChooseBillingMethodVisibility,
    } = useDepositFunds()

    return {
      depositFundsData,
      update,
      waitingForResponse,
      errors,
      resetRequestFailed,
      responseErrorMessage,
      togglePopupChooseBillingMethodVisibility,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/popups/PopupChooseBillingMethod';
</style>
