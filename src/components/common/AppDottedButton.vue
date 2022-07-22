<template>
  <button class="open-menu-button" type="button" :class="buttonClasses">
    <span class="button-dot"></span>
    <span class="button-dot"></span>
    <span class="button-dot"></span>
  </button>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

type AppDottedButtonSize = 'sm' | 'md' | 'lg'

export default defineComponent({
  props: {
    size: {
      type: String as PropType<AppDottedButtonSize>,
      default: 'md',
    },
  },
  setup(props) {
    const buttonClasses = computed(() => {
      let buttonSize = `--${props.size}`
      return `${buttonSize}`
    })

    return {
      buttonClasses,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/common/AppDottedButton';
</style>
