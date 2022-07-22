<template>
  <svg class="icon search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M7.12528 13.2506C10.5082 13.2506 13.2506 10.5082 13.2506 7.12528C13.2506 3.74238 10.5082 1 7.12528 1C3.74238 1 1 3.74238 1 7.12528C1 10.5082 3.74238 13.2506 7.12528 13.2506Z"
      :stroke="color"
      fill="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <path
      d="M11.4561 11.4567L15 15.0007"
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
  name: 'SearchIcon',
  props: {
    color: {
      type: String,
      default: variables.cPrimary500,
    },
  },
})
</script>
