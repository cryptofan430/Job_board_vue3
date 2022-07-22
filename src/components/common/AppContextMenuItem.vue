<template>
  <li class="context-menu-item" :class="classList" tabindex="0" @click.stop="handleClick">
    <slot></slot>
  </li>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const handleClick = (e: MouseEvent) => {
      if (!props.disabled) {
        emit('click', e)
      }
    }

    const classList = computed(() => {
      const disabledClasses = props.disabled ? '--disabled' : ''

      return `${disabledClasses}`
    })

    return {
      handleClick,
      classList,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/common/AppContextMenuItem';
</style>
