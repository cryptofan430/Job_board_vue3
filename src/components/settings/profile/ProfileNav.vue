<template>
  <div>
    <div class="account-type-nav">
      <router-link class="link" :to="{ name: 'SettingsMarketerProfile' }">Marketer’s information</router-link>
      <router-link class="link" :to="{ name: 'SettingsInfluencerProfile' }">Influencer’s information</router-link>
    </div>

    <div class="mobile-account-type-nav">
      <router-link class="link" :to="{ name: 'SettingsMarketerProfile' }" @click.prevent="marketerNav()"
        >Marketer’s</router-link
      >
      <router-link class="link" :to="{ name: 'SettingsInfluencerProfile' }" @click.prevent="influencerNav()"
        >Influencer’s</router-link
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  emits: ['send-nav'],
  setup(_, { emit }) {
    const router = useRouter()

    const marketerNav = () => {
      router.push({ name: 'SettingsMarketerProfile' })
      emit('send-nav', 'marketer')
    }

    const influencerNav = () => {
      router.push({ name: 'SettingsInfluencerProfile' })
      emit('send-nav', 'influencer')
    }

    return {
      influencerNav,
      marketerNav,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/profile/ProfileNav';
</style>
