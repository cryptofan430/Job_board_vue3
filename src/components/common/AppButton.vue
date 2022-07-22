<template>
  <button ref="buttonEl" class="button" :class="classList" :disabled="disabled">
    <span v-if="isLoading" class="loading">&nbsp;</span>

    <slot v-else-if="!icon.length"></slot>

    <i v-else class="button-icon-wrapper">
      <AppIcon :name="icon" :size="iconSize" :color="iconColor" />
    </i>
  </button>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, ref } from 'vue'
import AppIcon, { IconName, IconSize } from './AppIcon.vue'
import variables from '@/assets/variables'

type AppButtonSize = 'xsm' | 'sm' | 'md' | 'lg'

export default defineComponent({
  name: 'AppButton',
  components: { AppIcon },
  props: {
    size: {
      type: String as PropType<AppButtonSize>,
      default: 'md',
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String as PropType<IconName>,
      default: '',
    },
    iconColor: {
      type: String,
      required: false,
    },
    iconSize: {
      type: String as PropType<IconSize>,
      required: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const buttonEl = ref<HTMLButtonElement | null>(null)

    const focusEl = () => {
      buttonEl.value?.focus()
    }

    const classList = computed(() => {
      let sizeClass = `--${props.size}`
      if (props.icon.length) sizeClass = '--icon'

      const filledClass = props.outlined ? `--outlined` : '--filled'
      const loadingClass = props.isLoading ? `--loading` : ``

      return `${sizeClass} ${filledClass} ${loadingClass}`
    })

    return { buttonEl, classList, variables, focusEl }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/common/AppButton';
</style>
