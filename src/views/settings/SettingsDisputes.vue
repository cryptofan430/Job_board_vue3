<template>
  <div class="disputes-root">
    <DisputesNav @send-nav="navHandle" />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DisputesNav from '@/components/settings/disputes/DisputesNav.vue'

export default defineComponent({
  components: {
    DisputesNav,
  },
  emits: ['nav-send'],
  setup(_, { emit }) {
    const navHandle = (e: string) => {
      emit('nav-send', e)
    }

    return {
      navHandle,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/disputes/SettingsDisputes';
</style>
