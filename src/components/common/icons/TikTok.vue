<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="32px"
    height="32px"
    viewBox="0 0 32 32"
    version="1.1"
  >
    <g id="surface1">
      <path
        :fill="color"
        style="stroke: none; fill-rule: nonzero; fill-opacity: 1"
        d="M 7.605469 0 L 24.394531 0 C 28.59375 0 32 3.40625 32 7.605469 L 32 24.394531 C 32 28.59375 28.59375 32 24.394531 32 L 7.605469 32 C 3.40625 32 0 28.59375 0 24.394531 L 0 7.605469 C 0 3.40625 3.40625 0 7.605469 0 Z M 7.605469 0 "
      />
      <path
        style="stroke: none; fill-rule: nonzero; fill: rgb(100%, 100%, 100%); fill-opacity: 1"
        d="M 25.667969 9.578125 C 19.6875 9.003906 19.800781 3.75 19.800781 3.75 L 15.945312 3.75 L 15.945312 20.351562 C 15.847656 22.125 14.378906 23.515625 12.601562 23.515625 C 10.753906 23.515625 9.253906 22.015625 9.253906 20.167969 C 9.253906 18.316406 10.753906 16.820312 12.601562 16.820312 C 12.992188 16.820312 13.378906 16.886719 13.746094 17.019531 L 13.785156 12.636719 C 13.375 12.566406 12.960938 12.535156 12.546875 12.535156 C 8.46875 12.535156 5.15625 15.84375 5.15625 19.921875 C 5.15625 24.003906 8.46875 27.3125 12.546875 27.3125 C 16.492188 27.3125 19.738281 24.21875 19.929688 20.28125 L 19.929688 11.632812 C 19.929688 11.632812 22.050781 13.460938 25.667969 13.539062 Z M 25.667969 9.578125 "
      />
    </g>
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import variables from '@/assets/variables'
import { IconSize } from '../AppIcon.vue'

export default defineComponent({
  name: 'TwitchIcon',
  props: {
    color: {
      type: String,
      default: variables.cPrimary500,
    },
    size: {
      type: String as PropType<IconSize>,
      default: 'lg',
    },
  },
  setup(props) {
    const edgeSize = computed(() => {
      if (props.size === 'md') return 32
      return 40
    })

    return { edgeSize }
  },
})
</script>
