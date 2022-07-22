<template>
  <p class="input-error">
    <slot></slot>
  </p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({ name: 'AppInputError' })
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/common/AppInputError';
</style>
