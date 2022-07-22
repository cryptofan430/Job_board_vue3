<template>
  <li :class="`toast --${toastType}`">
    <AppIcon :name="getIconName()" size="md" />
    <p class="toast-content">
      <slot></slot>
    </p>
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import AppIcon from '@/components/common/AppIcon.vue'
import { ToastType } from '@/types/toast.model'

export default defineComponent({
  components: {
    AppIcon,
  },
  props: {
    toastType: {
      type: String as PropType<ToastType>,
      default: 'base',
    },
  },
  setup(props) {
    const getIconName = () => {
      if (props.toastType === 'success' || props.toastType === 'danger') {
        return `${props.toastType}-message`
      }

      return `info-message`
    }

    return { getIconName }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/common/AppToast';
</style>
