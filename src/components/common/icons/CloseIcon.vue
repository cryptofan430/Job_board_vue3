<template>
  <svg class="icon close-icon" width="24" height="24" viewBox="0 0 24 24">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M15.5303 8.46967C15.8232 8.76256 15.8232 9.23744 15.5303 9.53033L9.53033 15.5303C9.23744 15.8232 8.76256 15.8232 8.46967 15.5303C8.17678 15.2374 8.17678 14.7626 8.46967 14.4697L14.4697 8.46967C14.7626 8.17678 15.2374 8.17678 15.5303 8.46967Z"
      :fill="color"
    />

    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M8.46967 8.46967C8.76256 8.17678 9.23744 8.17678 9.53033 8.46967L15.5303 14.4697C15.8232 14.7626 15.8232 15.2374 15.5303 15.5303C15.2374 15.8232 14.7626 15.8232 14.4697 15.5303L8.46967 9.53033C8.17678 9.23744 8.17678 8.76256 8.46967 8.46967Z"
      :fill="color"
    />

    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M3 4.5C3 3.67157 3.67157 3 4.5 3H19.5C20.3284 3 21 3.67157 21 4.5V19.5C21 20.3284 20.3284 21 19.5 21H4.5C3.67157 21 3 20.3284 3 19.5V4.5ZM19.5 4.5H4.5V19.5H19.5V4.5Z"
      :fill="color"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import variables from '@/assets/variables'

export default defineComponent({
  name: 'CloseIcon',
  props: {
    color: {
      type: String,
      default: variables.cPrimary900,
    },
  },
})
</script>
