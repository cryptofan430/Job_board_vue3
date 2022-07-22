<template>
  <section v-if="!isMobilePopup" class="settings-billing">
    <DepositBalance />
  </section>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import DepositBalance from '@/components/settings/billings/DepositBalance.vue'
import { getIsMobilePopup } from '@/components/helpers/dom'

export default defineComponent({
  name: 'SettingsBilling',
  components: {
    DepositBalance,
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
@import '@/assets/styles/views/settings/SettingsBilling';
</style>
