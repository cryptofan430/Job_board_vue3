<template>
  <main class="settings" :class="classList">
    <h1 v-if="!isMobilePopup" class="title">Settings</h1>

    <div class="container">
      <SettingsNav v-if="!isMobilePopup" :selected-nav="selectedNav" />
      <router-view @nav-send="navHandle" />
    </div>
  </main>
</template>

<script lang="ts">
import { getIsMobilePopup } from '@/components/helpers/dom'
import SettingsNav from '@/components/settings/SettingsNav.vue'
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Settings',
  components: { SettingsNav },
  setup() {
    const isMobilePopup = getIsMobilePopup()
    const classList = computed(() => {
      const mobilePopup = isMobilePopup.value ? '--mobile-popup' : ''

      return `${mobilePopup}`
    })

    const selectedNav = ref()

    const navHandle = (e: string) => (selectedNav.value = e)

    return {
      isMobilePopup,
      classList,
      navHandle,
      selectedNav,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/Settings';
</style>
