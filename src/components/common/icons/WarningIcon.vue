<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="16" :height="16" :viewBox="`0 0 ${16} ${16}`" fill="none">
    <path
      d="M8.00016 14.6667C11.6668 14.6667 14.6668 11.6667 14.6668 7.99999C14.6668 4.33333 11.6668 1.33333 8.00016 1.33333C4.3335 1.33333 1.3335 4.33333 1.3335 7.99999C1.3335 11.6667 4.3335 14.6667 8.00016 14.6667Z"
      :fill="color"
    />
    <path d="M8 5.33333V8.66666" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M7.99658 10.6667H8.00257" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import variables from '@/assets/variables'
import { IconSize } from '../AppIcon.vue'

export default defineComponent({
  name: 'WarningIcon',
  props: {
    color: {
      type: String,
      default: variables.cGrey000,
    },
    size: {
      type: String as PropType<IconSize>,
      default: 'lg',
    },
  },
  setup(props) {
    const edgeSize = computed(() => {
      if (props.size === 'md') return 24
      if (props.size === 'sm') return 16
      return 32
    })

    return { edgeSize }
  },
})
</script>
