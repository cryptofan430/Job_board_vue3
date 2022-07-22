<template>
  <div class="insights-content">
    <AppErrorBox v-if="isError" @clicked="initYoutubeInsights">insight</AppErrorBox>
    <AppSkeleton v-else-if="isLoading" />

    <div v-else>
      <h1 class="instagram-insight-header">Youtube Insight</h1>

      <AppExpandMenu class="expandable">
        <template #header>
          <h2 class="cities-caption">Audience By Countries</h2>
        </template>
        <table class="cities-table">
          <tbody>
            <tr>
              <th class="cities-header">Country</th>
              <th class="cities-header">Views</th>
              <th class="cities-header">Likes</th>
            </tr>
            <tr
              v-for="youtubeMetric in getYoutubeInsight?.youtubeLifetimeMetricsGrouped.countryMetrics"
              :key="youtubeMetric.country"
            >
              <th class="cities-header">{{ youtubeMetric.country }}</th>
              <td class="cities-value">{{ youtubeMetric.views }}</td>
              <td class="cities-value">{{ youtubeMetric.likes }}</td>
            </tr>
          </tbody>
        </table>
      </AppExpandMenu>

      <AppExpandMenu class="expandable">
        <template #header>
          <h2 class="cities-caption">Audience By Gender</h2>
        </template>
        <table class="cities-table">
          <tbody>
            <tr>
              <th class="cities-header">Gender</th>
              <th class="cities-header">View Percentage</th>
            </tr>
            <tr
              v-for="youtubeMetric in getYoutubeInsight?.youtubeLifetimeMetricsGrouped.genderMetrics"
              :key="youtubeMetric.gender"
            >
              <td class="cities-header">{{ getGender(youtubeMetric.gender) }}</td>
              <td class="cities-header">{{ youtubeMetric.viewerPercentage }}%</td>
            </tr>
          </tbody>
        </table>
      </AppExpandMenu>

      <AppExpandMenu class="expandable">
        <template #header>
          <h2 class="cities-caption">Audience By Age</h2>
        </template>
        <table class="cities-table">
          <tbody>
            <tr>
              <th class="cities-header">Age</th>
              <th class="cities-header">View Percentage</th>
            </tr>
            <tr
              v-for="youtubeMetric in getYoutubeInsight?.youtubeLifetimeMetricsGrouped.ageGroupMetrics"
              :key="youtubeMetric.fromAge"
            >
              <td class="cities-header">{{ youtubeMetric.fromAge + '-' + youtubeMetric.untilAge }}</td>
              <td class="cities-header">{{ youtubeMetric.viewerPercentage }}%</td>
            </tr>
          </tbody>
        </table>
      </AppExpandMenu>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useYoutubeInsights from './youtube-insight'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppExpandMenu from '@/components/common/AppExpandMenu.vue'
import { Gender } from '@/types/social-account.model'

export default defineComponent({
  name: 'InsightsContent',
  components: {
    AppErrorBox,
    AppSkeleton,
    AppExpandMenu,
  },
  setup() {
    const { isLoaded, isLoading, isError, getYoutubeInsight, initYoutubeInsights } = useYoutubeInsights()

    const getGender = (gender: Gender) => {
      if (gender === Gender.M) return 'Male'
      if (gender === Gender.F) return 'Female'
      if (gender === Gender.U) return 'Unknown'
    }

    return { isLoaded, isLoading, isError, getGender, getYoutubeInsight, initYoutubeInsights }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/insights/YoutubeContent';
</style>
