<template>
  <div class="popup">
    <div class="popup-content">
      <AppCloseButton @click="onClose" />

      <h3 class="popup-title">Please, choose billing method that you prefer to use.</h3>

      <BillingCard side="front" name="Name Surname" number="**** **** **** 1234" expiration-date="DD/MM" />

      <AppLabel>
        Card number
        <AppInput />
      </AppLabel>

      <AppLabel>
        Cardholder name
        <AppInput />
      </AppLabel>

      <div class="row">
        <AppLabel>
          Expiration date
          <AppInput />
        </AppLabel>

        <AppLabel>
          CVV
          <AppInput />
        </AppLabel>
      </div>

      <AppButton>Add method</AppButton>

      <p class="divider-content">or</p>

      <p class="popup-title">Use my account’s balance for billing</p>

      <BillingCard side="back" number="**** **** **** 1234" expiration-date="DD/MM" :money="300" />

      <AppButton>Add method</AppButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppCloseButton from '@/components/common/AppCloseButton.vue'
import AppButton from '@/components/common/AppButton.vue'
import BillingCard from '@/components/cards/BillingCard.vue'

import AppLabel from '@/components/common/AppLabel.vue'
import AppInput from '@/components/common/AppInput.vue'

export default defineComponent({
  name: 'PopupAddBillingMethod',
  components: {
    AppCloseButton,
    AppButton,
    AppLabel,
    AppInput,
    BillingCard,
  },
  emits: ['close'],
  setup(_, { emit }) {
    const onClose = () => {
      emit('close')
    }

    return { onClose }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/popups/PopupAddBillingMethod';
</style>
