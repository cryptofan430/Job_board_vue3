<template>
  <svg class="icon success-message-icon" :width="edgeSize" :height="edgeSize" :viewBox="`0 0 ${edgeSize} ${edgeSize}`">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M17.5976 7.39567C17.9314 7.72578 17.9344 8.26396 17.6043 8.59774L10.6812 15.5977C10.5216 15.7591 10.304 15.85 10.077 15.85C9.85005 15.8501 9.63247 15.7593 9.47277 15.598L7.39585 13.5001C7.06558 13.1665 7.06828 12.6283 7.40189 12.2981C7.7355 11.9678 8.27368 11.9705 8.60396 12.3041L10.0765 13.7916L16.3956 7.40231C16.7257 7.06854 17.2638 7.06557 17.5976 7.39567Z"
      fill="white"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.9999 2.85002C6.9465 2.85002 2.8499 6.94662 2.8499 12C2.8499 17.0534 6.9465 21.15 11.9999 21.15C17.0533 21.15 21.1499 17.0534 21.1499 12C21.1499 6.94662 17.0533 2.85002 11.9999 2.85002ZM1.1499 12C1.1499 6.00774 6.00761 1.15002 11.9999 1.15002C17.9922 1.15002 22.8499 6.00774 22.8499 12C22.8499 17.9923 17.9922 22.85 11.9999 22.85C6.00761 22.85 1.1499 17.9923 1.1499 12Z"
      fill="white"
    />
    />
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import variables from '@/assets/variables'
import { IconSize } from '../AppIcon.vue'

export default defineComponent({
  name: 'SuccessMessageIcon',
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
