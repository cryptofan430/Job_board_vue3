<template>
  <div class="payment-method">
    <BillingCard side="front" name="Name Surname" number="**** **** **** 1234" expiration-date="DD/MM" />
    <div class="delete-account">
      <AppButton outlined>Delete account</AppButton>
      <p class="mobile-delete-account">Delete</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import BillingCard from '@/components/cards/BillingCard.vue'

export default defineComponent({
  name: 'PaymentMethod',
  components: { AppButton, BillingCard },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/settings-payment/PaymentMethod';
</style>
