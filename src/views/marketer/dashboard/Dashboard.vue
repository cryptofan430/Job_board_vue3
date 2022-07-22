<template>
  <main class="dashboard">
    <h1 class="title">My dashboard</h1>
    <router-view />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({ name: 'Dashboard' })
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/dashboard/Dashboard';
</style>
