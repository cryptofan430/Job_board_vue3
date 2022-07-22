<template>
  <div class="popup">
    <div class="popup-content">
      <AppCloseButton class="popup-close-button" @click="onClose" />
      <AppBackButton button-text="Back" :back-route="{ name: $route.meta.backRoute }" class="popup-back-button" />

      <h3 class="popup-title">Please, choose payment method that you prefer to use.</h3>

      <AppLabel class="card-label">
        <AppRadioButton />
        <BillingCard
          class="billing-method-card"
          side="front"
          name="Name Surname"
          number="**** **** **** 1234"
          expiration-date="DD/MM"
        />
      </AppLabel>

      <AppLabel>
        What sum do you want to transfer?
        <div class="budget-input-wrapper" data-currency="$">
          <AppInput class="popup-input" />
        </div>
      </AppLabel>

      <AppButton class="action-button">Submit</AppButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppCloseButton from '@/components/common/AppCloseButton.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppLabel from '@/components/common/AppLabel.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppRadioButton from '@/components/common/AppRadioButton.vue'
import AppBackButton from '@/components/common/AppBackButton.vue'

import BillingCard from '@/components/cards/BillingCard.vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'PopupGetPaid',
  components: {
    AppCloseButton,
    AppButton,
    AppLabel,
    AppInput,
    BillingCard,
    AppRadioButton,
    AppBackButton,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const onClose = () => {
      router.push({ name: route.meta.backRoute as string })
    }

    return { onClose }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/popups/PopupGetPaid';
</style>
