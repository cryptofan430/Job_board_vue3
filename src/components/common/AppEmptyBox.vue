<template>
  <div class="empty-box">
    <p class="empty-box-content" :class="classList">
      <slot></slot>
    </p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

type EmptyBoxVariation = 'primary' | 'saturated'

export default defineComponent({
  props: {
    variant: {
      type: String as PropType<EmptyBoxVariation>,
      default: 'saturated',
    },
  },
  setup(props) {
    const classList = computed(() => {
      const variant = `--${props.variant}`

      return `${variant}`
    })

    return { classList }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/common/AppEmptyBox';
</style>
