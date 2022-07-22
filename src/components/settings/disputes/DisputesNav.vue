<template>
  <div>
    <nav class="disputes-nav">
      <router-link class="link" :to="{ name: 'SettingsMarketerDisputes' }">Marketer Disputes</router-link>
      <router-link class="link" :to="{ name: 'SettingsInfluencerDisputes' }">Influencer Disputes</router-link>
    </nav>
    <nav class="mobile-disputes-nav">
      <router-link class="link" :to="{ name: 'SettingsMarketerDisputes' }" @click.prevent="marketerNav()"
        >Marketer's</router-link
      >
      <router-link class="link" :to="{ name: 'SettingsInfluencerDisputes' }" @click.prevent="influencerNav()"
        >Influencer's</router-link
      >
    </nav>
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
      router.push({ name: 'SettingsMarketerDisputes' })
      emit('send-nav', 'marketer')
    }

    const influencerNav = () => {
      router.push({ name: 'SettingsInfluencerDisputes' })
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
@import '@/assets/styles/views/settings/disputes/DisputesNav';
</style>
