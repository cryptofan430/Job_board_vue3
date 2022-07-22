<template>
  <main class="insights">
    <!-- <InsightsHeader /> -->

    <InsightsContent />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import InsightsHeader from '@/components/influencer/insights/InsightsHeader.vue'
import InsightsContent from '@/components/insights/InsightsContent.vue'
import useInstagramInsights from '@/components/insights/instagram-insights'

export default defineComponent({
  name: 'Insights',
  components: {
    // InsightsHeader,
    InsightsContent,
  },
  setup() {
    const { initInstagramInsights } = useInstagramInsights()

    initInstagramInsights()

    return {
      initInstagramInsights,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/insights/Insights';
</style>
