<template>
  <svg class="icon menu-icon" xmlns="http://www.w3.org/2000/svg" width="26" height="18" viewBox="0 0 26 18" fill="none">
    <rect width="26" height="2" rx="1" :fill="color" />
    <rect y="8" width="26" height="2" rx="1" :fill="color" />
    <rect y="16" width="26" height="2" rx="1" :fill="color" />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import variables from '@/assets/variables'

export default defineComponent({
  name: 'MenuIcon',
  props: {
    color: {
      type: String,
      default: variables.cGrey000,
    },
  },
})
</script>
