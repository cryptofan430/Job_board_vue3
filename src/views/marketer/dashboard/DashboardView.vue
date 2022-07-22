<template>
  <TheTasks />
  <TheContracts />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TheTasks from '@/components/marketer/dashboard/TheTasks.vue'
import TheContracts from '@/components/marketer/dashboard/TheContracts.vue'

export default defineComponent({
  name: 'DashboardView',
  components: {
    TheTasks,
    TheContracts,
  },
})
</script>
