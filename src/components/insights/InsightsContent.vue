<template>
  <div class="insights-content">
    <AppErrorBox v-if="isError" @clicked="initInstagramInsights">insight</AppErrorBox>
    <AppSkeleton v-else-if="isLoading" />

    <div v-else>
      <h1 class="instagram-insight-header">Instagram Insight</h1>

      <AppExpandMenu class="expandable">
        <template #header>
          <h2 class="cities-caption">Audience By Countries</h2>
        </template>
        <table class="cities-table">
          <tbody>
            <tr>
              <th class="cities-header">Country</th>
              <th class="cities-header">Auditory</th>
            </tr>
            <tr
              v-for="(value, name) in getInstagramInsight?.instagramLifetimeInsightGrouped.audienceCountry"
              :key="value"
            >
              <th class="cities-header">{{ name }}</th>
              <td class="cities-value">{{ value }}</td>
            </tr>
          </tbody>
        </table>
      </AppExpandMenu>

      <AppExpandMenu class="expandable">
        <template #header>
          <h2 class="cities-caption">Audience By Cities</h2>
        </template>
        <table class="cities-table">
          <tbody>
            <tr>
              <th class="cities-header">City</th>
              <th class="cities-header">Auditory</th>
            </tr>
            <tr v-for="(value, name) in getInstagramInsight?.instagramLifetimeInsightGrouped.audienceCity" :key="value">
              <th class="cities-header">{{ name }}</th>
              <td class="cities-value">{{ value }}</td>
            </tr>
          </tbody>
        </table>
      </AppExpandMenu>

      <AppExpandMenu class="expandable">
        <template #header>
          <h2 class="cities-caption">Followers By Locales</h2>
        </template>
        <table class="cities-table">
          <tbody>
            <tr>
              <th class="cities-header">Country, Language</th>
              <th class="cities-header">Auditory</th>
            </tr>
            <tr
              v-for="audienceLocale in getInstagramInsight?.instagramLifetimeInsightGrouped.audienceLocale"
              :key="audienceLocale.language + audienceLocale.country"
            >
              <th class="cities-header">{{ audienceLocale.country }}, {{ audienceLocale.language }}</th>
              <td class="cities-value">{{ audienceLocale.value }}</td>
            </tr>
          </tbody>
        </table>
      </AppExpandMenu>

      <AppExpandMenu class="expandable">
        <template #header>
          <h2 class="cities-caption">Followers By Gender And Age</h2>
        </template>
        <table class="cities-table">
          <tbody>
            <tr>
              <th class="cities-header">Gender</th>
              <th class="cities-header">Age</th>
              <th class="cities-header">Auditory</th>
            </tr>
            <tr
              v-for="genderAge in getInstagramInsight?.instagramLifetimeInsightGrouped.audienceGenderAge"
              :key="genderAge.fromAge + '' + genderAge.untilAge + genderAge.gender"
            >
              <td class="cities-header">{{ getGender(genderAge.gender) }}</td>
              <td class="cities-header">{{ genderAge.fromAge }} - {{ genderAge.untilAge }}</td>
              <td class="cities-value">{{ genderAge.value }}</td>
            </tr>
          </tbody>
        </table>
      </AppExpandMenu>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useInstagramInsights from './instagram-insights'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppExpandMenu from '@/components/common/AppExpandMenu.vue'

export default defineComponent({
  name: 'InsightsContent',
  components: {
    AppErrorBox,
    AppSkeleton,
    AppExpandMenu,
  },
  setup() {
    const { isLoaded, isLoading, isError, getInstagramInsight, initInstagramInsights } = useInstagramInsights()

    const getGender = (gender: 'F' | 'M' | 'U') => {
      if (gender === 'M') return 'Male'
      if (gender === 'F') return 'Female'
      return 'Both'
    }

    return { isLoaded, getGender, isLoading, isError, getInstagramInsight, initInstagramInsights }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/insights/InsightsContent';
</style>
