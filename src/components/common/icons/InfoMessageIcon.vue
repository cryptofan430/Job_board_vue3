<template>
  <svg class="icon info-message-icon" :width="edgeSize" :height="edgeSize" :viewBox="`0 0 ${edgeSize} ${edgeSize}`">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.9999 2.85002C6.9465 2.85002 2.8499 6.94662 2.8499 12C2.8499 17.0534 6.9465 21.15 11.9999 21.15C17.0533 21.15 21.1499 17.0534 21.1499 12C21.1499 6.94662 17.0533 2.85002 11.9999 2.85002ZM1.1499 12C1.1499 6.00774 6.00761 1.15002 11.9999 1.15002C17.9922 1.15002 22.8499 6.00774 22.8499 12C22.8499 17.9923 17.9922 22.85 11.9999 22.85C6.00761 22.85 1.1499 17.9923 1.1499 12Z"
      fill="white"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.9999 11.15C12.4693 11.15 12.8499 11.5306 12.8499 12V16C12.8499 16.4695 12.4693 16.85 11.9999 16.85C11.5305 16.85 11.1499 16.4695 11.1499 16V12C11.1499 11.5306 11.5305 11.15 11.9999 11.15Z"
      fill="white"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.1499 8.00002C11.1499 7.53058 11.5305 7.15002 11.9999 7.15002H12.0099C12.4793 7.15002 12.8599 7.53058 12.8599 8.00002C12.8599 8.46947 12.4793 8.85002 12.0099 8.85002H11.9999C11.5305 8.85002 11.1499 8.46947 11.1499 8.00002Z"
      fill="white"
    />
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import variables from '@/assets/variables'
import { IconSize } from '../AppIcon.vue'

export default defineComponent({
  name: 'InfoMessageIcon',
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
