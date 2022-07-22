<template>
  <svg class="icon twitch-icon" :width="edgeSize" :height="edgeSize" :viewBox="`0 0 ${edgeSize} ${edgeSize}`">
    <template v-if="size === 'md'">
      <path
        d="M8.19004 0.533325L2.6665 6.05686V25.9431H9.2959V31.4667L14.8194 25.9431H19.2352L29.1802 16V0.533325H8.19004ZM26.9704 14.8961L22.5528 19.3137H18.1332L14.2665 23.1804V19.3137H9.2959V2.74313H26.9704V14.8961Z"
        :fill="color"
      />

      <path
        d="M23.6569 6.60974H21.4471V13.2353H23.6569V6.60974ZM17.5804 6.60974H15.3706V13.2353H17.5804V6.60974Z"
        :fill="color"
      />
    </template>

    <template v-else>
      <path
        d="M10.2379 0.666687L3.3335 7.5711V32.4289H11.6202V39.3334L18.5247 32.4289H24.0443L36.4757 20V0.666687H10.2379ZM33.7134 18.6201L28.1913 24.1422H22.6668L17.8335 28.9755V24.1422H11.6202V3.42894H33.7134V18.6201Z"
        :fill="color"
      />

      <path
        d="M29.5712 8.26221H26.809V16.5441H29.5712V8.26221ZM21.9756 8.26221H19.2134V16.5441H21.9756V8.26221Z"
        :fill="color"
      />
    </template>
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
