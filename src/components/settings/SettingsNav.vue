<template>
  <div class="container-nav">
    <div class="desktop-settings-nav">
      <nav class="settings-nav">
        <router-link to="/settings/profile" class="link">Profile information</router-link>

        <router-link class="link" to="/settings/social-media">Social media accounts</router-link>

        <router-link class="link" to="/settings/payment">Get paid</router-link>

        <router-link class="link" to="/settings/billing">Deposit funds</router-link>

        <router-link class="link" to="/settings/tax-info">Tax information</router-link>

        <router-link class="link" to="/settings/transactions">Transaction history</router-link>

        <router-link class="link" to="/settings/account">Account information</router-link>

        <router-link class="link" to="/settings/help">Help</router-link>

        <router-link class="link" to="/settings/disputes">Disputes</router-link>
      </nav>
    </div>
    <div class="mobile-settings-nav">
      <AppNavigation :values="OPTIONS" class="settings-nav" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'
import AppNavigation from '@/components/common/AppNavigation.vue'

export default defineComponent({
  name: 'SettingsNav',
  components: {
    AppNavigation,
  },
  props: {
    selectedNav: {
      type: String,
      default: 'marketer',
    },
  },
  setup(props) {
    const nav = ref('marketer')

    watch(props, () => {
      nav.value = props.selectedNav
    })

    var OPTIONS = computed(() => {
      return [
        {
          title: 'Profile information',
          slug: 'profile information',
          url: `/settings/profile/${nav.value}`,
        },
        {
          title: 'Social media accounts',
          slug: 'social media accounts',
          url: '/settings/social-media',
        },
        {
          title: 'Get paid',
          slug: 'get paid',
          url: '/settings/payment',
        },
        {
          title: 'Deposit funds',
          slug: 'deposit funds',
          url: '/settings/billing',
        },
        {
          title: 'Tax information',
          slug: 'tax information',
          url: `/settings/tax-info/${nav.value}`,
        },
        {
          title: 'Transaction history',
          slug: 'transaction history',
          url: '/settings/transactions',
        },
        {
          title: 'Account information',
          slug: 'account information',
          url: '/settings/account',
        },
        {
          title: 'Help',
          slug: 'help',
          url: '/settings/help',
        },
        {
          title: 'Disputes',
          slug: 'disputes',
          url: `/settings/disputes/${nav.value}`,
        },
      ]
    })

    return {
      OPTIONS,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/SettingsNav';
</style>
