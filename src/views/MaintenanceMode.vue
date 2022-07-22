<template>
  <main class="content-wrapper">
    <h1 class="maintenance-title">Ongoing maintenance</h1>
    <p class="maintenance-text">
      The platform will be back on <span class="end-date">{{ maintenanceModeEndDate }} </span>
    </p>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { maintenanceModeEndDate } from '@/components/constants/maintenance'

export default defineComponent({
  name: 'MaintenanceMode',

  setup() {
    return { maintenanceModeEndDate }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/MaintenanceMode';
</style>
