<template>
  <section v-if="!isMobilePopup" class="settings-payment">
    <PaymentBalance />

    <div class="payment-methods">
      <p class="payments-title">Payment method</p>

      <PaymentMethod />

      <AppLink :to="{ name: 'AddPaymentMethodPopup' }">Add method</AppLink>
    </div>
    <div class="mobile-add-method">
      <AppLink :to="{ name: 'AddPaymentMethodPopup' }">Add new method</AppLink>
    </div>
  </section>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import PaymentBalance from '@/components/settings/payment-methods/PaymentBalance.vue'
import PaymentMethod from '@/components/settings/payment-methods/PaymentMethod.vue'

import AppLink from '@/components/common/AppLink.vue'
import { getIsMobilePopup } from '@/components/helpers/dom'

export default defineComponent({
  name: 'SettingsPayment',
  components: {
    PaymentBalance,
    PaymentMethod,
    AppLink,
  },
  setup() {
    const isMobilePopup = getIsMobilePopup()

    return {
      isMobilePopup,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/SettingsPayment';
</style>
