<template>
  <div class="popup">
    <div class="popup-content">
      <AppBackButton button-text="Back" :back-route="{ name: $route.meta.backRoute }" class="popup-back-button" />
      <AppCloseButton class="popup-close-button" @click="onClose" />

      <h3 class="popup-title">Add a payment method</h3>

      <BillingCard side="front" name="Name Surname" number="**** **** **** 1234" expiration-date="DD/MM" />

      <AppLabel>
        Card number
        <AppInput class="popup-input" />
      </AppLabel>

      <AppLabel>
        Cardholder name
        <AppInput class="popup-input" />
      </AppLabel>

      <div class="row">
        <AppLabel>
          Expiration date
          <AppInput class="popup-input-half" />
        </AppLabel>

        <AppLabel>
          CVV
          <AppInput class="popup-input-half" />
        </AppLabel>
      </div>

      <AppButton class="add-method-button action-button">Add method</AppButton>
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
import AppBackButton from '@/components/common/AppBackButton.vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'PopupAddPaymentMethod',
  components: {
    AppCloseButton,
    AppBackButton,
    AppButton,
    AppLabel,
    AppInput,
    BillingCard,
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
@import '@/assets/styles/views/settings/popups/PopupAddPaymentMethod';
</style>
