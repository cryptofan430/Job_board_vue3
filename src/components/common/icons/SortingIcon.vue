<template>
  <svg class="icon sorting-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <path
      d="M15.667 13.9166L12.0003 17.5833L8.33366 13.9166"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <path
      d="M8.3335 9.16667L12.0002 5.5L15.6668 9.16667"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import variables from '@/assets/variables'

export default defineComponent({
  name: 'SortingIcon',
  props: {
    color: {
      type: String,
      default: variables.cPrimary500,
    },
  },
})
</script>
