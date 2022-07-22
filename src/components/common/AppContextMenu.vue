<template>
  <ul
    ref="contextMenuEl"
    class="context-menu"
    tabindex="-1"
    :class="classList"
    @focusin="preventFromClosing"
    @focusout="closeMenu"
  >
    <slot></slot>
  </ul>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'ContextMenu',
  props: {
    primary: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const contextMenuEl = ref<HTMLElement | null>()

    const timer = ref<null | number>(null)

    const emitClose = () => emit('close')

    const preventFromClosing = () => {
      if (timer.value) {
        clearTimeout(timer.value)
        timer.value = null
      }
    }

    const closeMenu = () => {
      timer.value = setTimeout(() => emitClose())
    }

    onMounted(() => {
      if (contextMenuEl.value) {
        contextMenuEl.value.focus()
      }
    })

    const classList = computed(() => {
      const variantStyle = props.primary ? 'context-menu-primary' : ''

      return `${variantStyle}`
    })

    return {
      preventFromClosing,
      closeMenu,
      contextMenuEl,
      classList,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/common/AppContextMenu';
</style>
