<template>
  <svg
    class="icon dropdown-icon"
    :width="edgeSize"
    :height="edgeSize"
    :viewBox="`0 0 ${edgeSize} ${edgeSize}`"
    fill="none"
  >
    <template v-if="size === 'sm'">
      <path
        d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z"
        :stroke="color"
        stroke-width="1.5"
        stroke-miterlimit="10"
      />

      <path
        d="M10.625 7.125L8 10.0417L5.375 7.125"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>

    <template v-else>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11.75 3.5C7.19365 3.5 3.5 7.19365 3.5 11.75C3.5 16.3063 7.19365 20 11.75 20C16.3063 20 20 16.3063 20 11.75C20 7.19365 16.3063 3.5 11.75 3.5ZM2 11.75C2 6.36522 6.36522 2 11.75 2C17.1348 2 21.5 6.36522 21.5 11.75C21.5 17.1348 17.1348 21.5 11.75 21.5C6.36522 21.5 2 17.1348 2 11.75Z"
        :fill="color"
      />

      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.87328 10.0675C8.18117 9.79044 8.65538 9.8154 8.93248 10.1233L11.75 13.2539L14.5675 10.1233C14.8446 9.8154 15.3188 9.79044 15.6267 10.0675C15.9346 10.3446 15.9596 10.8188 15.6825 11.1267L12.3075 14.8767C12.1652 15.0348 11.9626 15.125 11.75 15.125C11.5374 15.125 11.3348 15.0348 11.1925 14.8767L7.81754 11.1267C7.54044 10.8188 7.5654 10.3446 7.87328 10.0675Z"
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
  name: 'DropdownIcon',
  props: {
    color: {
      type: String,
      default: variables.cPrimary500,
    },
    size: {
      type: String as PropType<IconSize>,
      default: 'md',
    },
  },
  setup(props) {
    const edgeSize = computed(() => {
      if (props.size === 'sm') return 16
      return 24
    })

    return { edgeSize }
  },
})
</script>
