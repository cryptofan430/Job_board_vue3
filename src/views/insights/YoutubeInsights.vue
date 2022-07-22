<template>
  <main class="insights">
    <!-- <InsightsHeader /> -->

    <InsightsContent />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import InsightsHeader from '@/components/influencer/insights/InsightsHeader.vue'
import InsightsContent from '@/components/insights/YoutubeContent.vue'
import useYoutubeInsights from '@/components/insights/youtube-insight'

export default defineComponent({
  name: 'Insights',
  components: {
    // InsightsHeader,
    InsightsContent,
  },
  setup() {
    const { initYoutubeInsights } = useYoutubeInsights()
    initYoutubeInsights()
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/insights/Insights';
</style>
