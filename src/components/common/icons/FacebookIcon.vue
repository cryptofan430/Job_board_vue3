<template>
  <svg class="icon facebook-icon" :width="edgeSize" :height="edgeSize" :viewBox="`0 0 ${edgeSize} ${edgeSize}`">
    <path
      v-if="size === 'md'"
      d="M10.6667 0C4.77563 0 0 4.77563 0 10.6667V21.3333C0 27.2244 4.77563 32 10.6667 32H21.3333C27.2244 32 32 27.2244 32 21.3333V10.6667C32 4.77563 27.2244 0 21.3333 0H10.6667ZM23.0195 4.17579C23.2519 4.17085 23.4939 4.1784 23.7441 4.19531C24.6635 4.19656 25.6237 4.27944 26.5762 4.36328L26.4726 8.15235H23.9141C22.7144 8.12579 22.2811 8.59163 22.2422 9.94531V12.9219H26.5762L26.4043 16.9805H22.2422V28.2793H18.0137V16.9805H15.0781V12.9219H18.0137V9.43749C18.0137 6.92525 19.0758 5.32619 21.168 4.51563C21.7053 4.30421 22.3223 4.19059 23.0195 4.17579Z"
      :fill="color"
    />

    <path
      v-else
      d="M13.3333 0C5.96954 0 0 5.96954 0 13.3333V26.6667C0 34.0305 5.96954 40 13.3333 40H26.6667C34.0305 40 40 34.0305 40 26.6667V13.3333C40 5.96954 34.0305 0 26.6667 0H13.3333ZM28.7744 5.21973C29.0649 5.21357 29.3674 5.223 29.6802 5.24413C30.8294 5.2457 32.0296 5.3493 33.2202 5.4541L33.0908 10.1904H29.8926C28.393 10.1572 27.8514 10.7395 27.8027 12.4316V16.1523H33.2202L33.0054 21.2256H27.8027V35.3491H22.5171V21.2256H18.8477V16.1523H22.5171V11.7969C22.5171 8.65657 23.8447 6.65773 26.46 5.64453C27.1316 5.38027 27.9029 5.23823 28.7744 5.21973Z"
      :fill="color"
    />
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import variables from '@/assets/variables'
import { IconSize } from '../AppIcon.vue'

export default defineComponent({
  name: 'FacebookIcon',
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
