<template>
  <div class="proposal-marketer-info">
    <AppErrorBox v-if="isError" @clicked="getTask">task</AppErrorBox>
    <template v-else-if="task">
      <p class="title">Marketer</p>

      <p class="name">{{ task?.marketerInfo?.firstName }} {{ task?.marketerInfo?.lastName }}</p>

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
    <AppSkeleton v-else></AppSkeleton>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import AppIcon from '@/components/common/AppIcon.vue'
import variables from '@/assets/variables'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import { TaskPublicInfo } from '@/types/tasks.model'
import { getDateAbsoluteFormatted } from '@/components/helpers/timeFormatter'

export default defineComponent({
  name: 'ProposalMarketerInfo',
  components: {
    AppIcon,
    AppErrorBox,
    AppSkeleton,
  },
  props: {
    task: {
      type: Object as PropType<TaskPublicInfo>,
      required: false,
    },
    isError: {
      type: Boolean,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['get-task'],
  setup(props, { emit }) {
    const dateFormatted = computed(() => {
      if (!props.task?.marketerInfo) return null
      return getDateAbsoluteFormatted(props.task?.marketerInfo.registerDate, true)
    })

    const moneySpentText = computed(() => {
      const moneyTransferred = props.task?.marketerInfo?.moneyTransferred
      if (moneyTransferred || moneyTransferred === 0) {
        return `$${moneyTransferred}`
      }
      return '-'
    })

    const locationText = computed(() => {
      const location = props.task?.marketerInfo?.location
      if (location) return location?.toString() || '-'
      return '-'
    })

    const marketerRatingText = computed(() => {
      const rating = props.task?.marketerInfo?.rating
      if (rating || rating === 0) return `${rating}/5`
      return '-'
    })

    const getTask = () => emit('get-task')

    return {
      dateFormatted,
      variables,
      moneySpentText,
      locationText,
      marketerRatingText,
      getTask,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/proposal-submit/ProposalMarketerInfo';
</style>
