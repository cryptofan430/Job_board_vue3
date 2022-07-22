<template>
  <svg class="icon logout-icon" width="24" height="24" viewBox="0 0 24 24">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M15.7832 7.5321C16.0761 7.23925 16.551 7.23931 16.8439 7.53224L20.7803 11.4697C21.0731 11.7626 21.0731 12.2374 20.7803 12.5303L16.8439 16.4678C16.551 16.7607 16.0761 16.7608 15.7832 16.4679C15.4903 16.175 15.4902 15.7002 15.7831 15.4072L19.1894 12L15.7831 8.59276C15.4902 8.29983 15.4903 7.82496 15.7832 7.5321Z"
      :fill="color"
    />

    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M9 12C9 11.5858 9.33579 11.25 9.75 11.25H20.2472C20.6615 11.25 20.9972 11.5858 20.9972 12C20.9972 12.4142 20.6615 12.75 20.2472 12.75H9.75C9.33579 12.75 9 12.4142 9 12Z"
      :fill="color"
    />

    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M3.43934 3.43934C3.72064 3.15804 4.10217 3 4.5 3H9.75C10.1642 3 10.5 3.33579 10.5 3.75C10.5 4.16421 10.1642 4.5 9.75 4.5L4.5 4.5L4.5 19.5H9.75C10.1642 19.5 10.5 19.8358 10.5 20.25C10.5 20.6642 10.1642 21 9.75 21H4.5C4.10218 21 3.72065 20.842 3.43934 20.5607C3.15804 20.2794 3 19.8978 3 19.5V4.5C3 4.10217 3.15804 3.72064 3.43934 3.43934Z"
      :fill="color"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import variables from '@/assets/variables'

export default defineComponent({
  name: 'LogoutIcon',
  props: {
    color: {
      type: String,
      default: variables.cGrey000,
    },
  },
})
</script>
