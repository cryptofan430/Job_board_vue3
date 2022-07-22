<template>
  <svg
    class="icon chat-send-icon"
    xmlns="http://www.w3.org/2000/svg"
    :width="edgeSize"
    :height="edgeSize"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M6.98318 7.64234L14.7289 5.06044C18.2036 3.9022 20.0978 5.7964 18.9395 9.2711L16.3576 17.0168C14.6203 22.2289 11.779 22.2228 10.0477 17.0168L9.52888 15.4484C9.39617 15.0502 8.9558 14.6098 8.55765 14.4771L6.98318 13.9523C1.77715 12.221 1.77715 9.37366 6.98318 7.64234Z"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
    <path
      d="M9.27539 14.7333L13.0902 11.393"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import variables from '@/assets/variables'
import { IconSize } from '../AppIcon.vue'

export default defineComponent({
  name: 'BackIcon',
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
