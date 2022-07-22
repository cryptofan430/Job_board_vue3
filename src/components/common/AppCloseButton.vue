<template>
  <button class="close-button">
    <AppIcon name="close" :color="variables.cPrimary500" />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from './AppIcon.vue'
import variables from '@/assets/variables'

export default defineComponent({
  name: 'AppCloseButton',
  components: { AppIcon },
  setup() {
    return { variables }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/common/AppCloseButton';
</style>
