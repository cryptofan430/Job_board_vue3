<template>
  <div>
    <div class="balance">
      <div class="header">
        <p class="title">Balance</p>

        <AppLink :to="{ name: 'DepositFundsPopup' }"> Deposit funds </AppLink>
      </div>
      <p class="balance-info">Your balance is ${{ getMyProfile?.money?.[0]?.value || 0 }}</p>
    </div>
    <div class="mobile-deposit-balance">
      <div class="header">
        <p class="title">Balance</p>
        <p class="balance-info">${{ getMyProfile?.money?.[0]?.value || 0 }}</p>
      </div>
      <AppLink :to="{ name: 'DepositFundsPopup' }"> Deposit funds </AppLink>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppLink from '@/components/common/AppLink.vue'
import useUserStore from '@/store/user'

export default defineComponent({
  name: 'DepositBalance',
  components: { AppLink },
  setup() {
    const { getMyProfile } = useUserStore()

    return {
      getMyProfile,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/settings-billing/DepositBalance';
</style>
