<template>
  <div class="proposal-marketer-info">
    <AppSkeleton v-if="isLoading"></AppSkeleton>
    <AppErrorBox v-else-if="isError">proposal</AppErrorBox>
    <template v-else-if="getProposalTask">
      <p class="title">Marketer</p>

      <p class="name">{{ getProposalTask.marketerInfo?.firstName }} {{ getProposalTask.marketerInfo?.lastName }}</p>

      <p class="company">Company’s name</p>

      <div class="marketer-metrics">
        <div class="icon-row" title="Location">
          <AppIcon name="location" :color="variables.cPrimary500" />
          <p class="icon-row-title">{{ locationText }}</p>
        </div>

        <div class="icon-row" title="Rating">
          <AppIcon name="rating" :color="variables.cPrimary500" />

          <p class="icon-row-title">
            {{ marketerRatingText }}
          </p>
        </div>

        <div class="icon-row" title="Money spent">
          <AppIcon name="money-spent" :color="variables.cPrimary500" />
          <p class="icon-row-title">{{ moneySpentText }}</p>
        </div>
      </div>

      <p class="since">Member since {{ dateFormatted }}</p>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import AppIcon from '@/components/common/AppIcon.vue'
import variables from '@/assets/variables'
import useInfluencerProposal from './proposal'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import { getDateAbsoluteFormatted } from '@/components/helpers/timeFormatter'

export default defineComponent({
  name: 'ProposalMarketerInfo',
  components: {
    AppIcon,
    AppErrorBox,
    AppSkeleton,
  },
  setup() {
    const { isLoading, isLoaded, isError, getProposalTask } = useInfluencerProposal()

    const dateFormatted = computed(() => {
      if (!getProposalTask?.value?.marketerInfo) {
        return null
      }
      return getDateAbsoluteFormatted(getProposalTask.value.marketerInfo?.registerDate, true)
    })

    const moneySpentText = computed(() => {
      const moneyTransferred = getProposalTask.value?.marketerInfo?.moneyTransferred
      if (moneyTransferred || moneyTransferred === 0) {
        return `$${moneyTransferred}`
      }
      return '-'
    })

    const locationText = computed(() => {
      const location = getProposalTask.value?.marketerInfo?.location
      if (location) return location?.toString() || '-'
      return '-'
    })

    const marketerRatingText = computed(() => {
      const rating = getProposalTask.value?.marketerInfo?.rating
      if (rating || rating === 0) return `${rating}/5`
      return '-'
    })

    return {
      variables,
      isLoading,
      isLoaded,
      isError,
      getProposalTask,
      dateFormatted,
      moneySpentText,
      locationText,
      marketerRatingText,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/proposal/ProposalMarketerInfo';
</style>
