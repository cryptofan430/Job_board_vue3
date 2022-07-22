<template>
  <router-link class="link" :class="classList">
    <slot></slot>
  </router-link>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'

type AppButtonSize = 'xsm' | 'sm' | 'md' | 'lg'

export default defineComponent({
  name: 'AppLink',
  props: {
    size: {
      type: String as PropType<AppButtonSize>,
      default: 'md',
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    responsive: {
      type: Boolean,
      required: false,
    },
  },
  setup(props) {
    const classList = computed(() => {
      const sizeClass = `--${props.size}`
      const filledClass = props.outlined ? `--outlined` : '--filled'
      const disabledClass = props.disabled ? '--disabled' : ''
      const responsive = props.responsive ? '--responsive' : ''

      return `${sizeClass} ${filledClass} ${disabledClass} ${responsive}`
    })

    return { classList }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/common/AppLink';
</style>
