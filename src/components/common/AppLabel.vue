<template>
  <label class="label" :class="`--${size} --${layout}`">
    <slot></slot>
  </label>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

type AppLabelSize = 'md' | 'sm'
type AppLabelResponsive = 'fixed' | 'responsive'

export default defineComponent({
  name: 'AppLabel',
  props: {
    size: {
      type: String as PropType<AppLabelSize>,
      default: 'md',
    },
    layout: {
      type: String as PropType<AppLabelResponsive>,
      default: 'fixed',
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/common/AppLabel';
</style>
