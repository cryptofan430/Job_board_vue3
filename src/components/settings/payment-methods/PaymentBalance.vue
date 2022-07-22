<template>
  <div>
    <div class="balance">
      <div class="header">
        <p class="title">Balance</p>

        <AppLink :to="{ name: 'GetPaidPopup' }">Get paid now</AppLink>
      </div>
      <p class="balance-info">Your balance is ${{ getMyProfile?.money?.[0]?.value || 0 }}</p>
    </div>
    <div class="mobile-balance">
      <div class="header">
        <p class="title">Balance</p>
        <p class="balance-info">${{ getMyProfile?.money?.[0]?.value || 0 }}</p>
      </div>
      <AppLink :to="{ name: 'GetPaidPopup' }">Get paid now</AppLink>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppLink from '@/components/common/AppLink.vue'
import useUserStore from '@/store/user'

export default defineComponent({
  name: 'PaymentBalance',
  components: {
    AppLink,
  },
  emits: ['get-paid'],
  setup(_, { emit }) {
    const getPaid = () => emit('get-paid')
    const { getMyProfile } = useUserStore()

    return { getPaid, getMyProfile }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/settings-payment/PaymentBalance';
</style>
