<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="edgeWidth"
    :height="edgeHeight"
    :viewBox="`0 0 ${edgeWidth} ${edgeHeight}`"
  >
    <path
      d="M21 1H1L9 10.46V17L13 19V10.46L21 1Z"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      :fill="fillColor"
    />
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import variables from '@/assets/variables'
import { IconSize } from '../AppIcon.vue'

export default defineComponent({
  name: 'FilterIcon',
  props: {
    color: {
      type: String,
      default: variables.cGrey500,
    },
    fillColor: {
      type: String,
      default: 'none',
    },
    size: {
      type: String as PropType<IconSize>,
      default: 'md',
    },
  },
  setup(props) {
    const edgeWidth = computed(() => {
      if (props.size === 'sm') return 14
      return 22
    })

    const edgeHeight = computed(() => {
      if (props.size === 'sm') return 12
      return 20
    })

    return { edgeWidth, edgeHeight }
  },
})
</script>
