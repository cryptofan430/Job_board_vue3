<template>
  <svg class="icon back-icon" width="24" height="24" viewBox="0 0 24 24">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M19.5 3C20.3284 3 21 3.67157 21 4.5V19.5C21 20.3284 20.3284 21 19.5 21H4.5C3.67157 21 3 20.3284 3 19.5V4.5C3 3.67157 3.67157 3 4.5 3L19.5 3ZM19.5 19.5V4.5L4.5 4.5V19.5H19.5Z"
      :fill="color"
    />

    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.9623 8.28766C12.2552 8.58056 12.2552 9.05543 11.9623 9.34832L9.31066 12L11.9623 14.6516C12.2552 14.9445 12.2552 15.4194 11.9623 15.7123C11.6694 16.0052 11.1945 16.0052 10.9016 15.7123L7.71967 12.5303C7.57902 12.3896 7.5 12.1989 7.5 12C7.5 11.801 7.57902 11.6103 7.71967 11.4696L10.9016 8.28766C11.1945 7.99477 11.6694 7.99477 11.9623 8.28766Z"
      :fill="color"
    />

    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M7.5 12C7.5 11.5858 7.83579 11.25 8.25 11.25H15.75C16.1642 11.25 16.5 11.5858 16.5 12C16.5 12.4142 16.1642 12.75 15.75 12.75H8.25C7.83579 12.75 7.5 12.4142 7.5 12Z"
      :fill="color"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import variables from '@/assets/variables'

export default defineComponent({
  name: 'BackIcon',
  props: {
    color: {
      type: String,
      default: variables.cGrey1000,
    },
  },
})
</script>
