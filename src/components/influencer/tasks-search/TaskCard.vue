<template>
  <div class="task-card">
    <div class="main">
      <div class="header">
        <h3 class="title" @click="goToTask">
          {{ task.title }}
        </h3>

        <span class="budget">{{ currencyFormatted }}</span>
      </div>

      <p class="time">{{ taskAddedTimeFormatted }}</p>

      <p ref="content" class="description line-clamped">
        {{ task.description }}
      </p>

      <span v-if="!detailsTriggerHidden" class="details" tabindex="0" @click="showDetails" @keydown.enter="showDetails">
        Details
      </span>

      <div class="platforms">
        <span class="platforms-text">Platform: </span>
        <AppTag v-for="platform in platformLabels" :key="platform" :outlined="true">
          {{ platform }}
        </AppTag>
      </div>
    </div>

    <div class="side">
      <div class="side-content-info">
        <p class="side-content">
          <AppIcon name="rating" />
          <span>
            {{ marketerRatingText }}
          </span>
        </p>

        <p class="side-content">
          <AppIcon name="money-spent" />
          <span>{{ moneySpentText }}</span>
        </p>

        <p class="side-content">
          <AppIcon name="location" class="task-location-icon" :color="variables.cPrimary900" />

          <span>{{ locationText }}</span>
        </p>
      </div>

      <p class="side-content-proposal">Proposals: {{ task.proposalCount }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import variables from '@/assets/variables'
import AppIcon from '@/components/common/AppIcon.vue'
import AppTag from '@/components/common/AppTag.vue'
import { TaskPublicInfo } from '@/types/tasks.model'
import { getFormattedRelativeDate } from '@/components/helpers/timeFormatter'
import { getCurrencySign } from '@/components/helpers/currencyFormatter'
import { getTaskPlatformLabel } from '@/components/helpers/platforms'
import useSubmitProposal from '@/components/influencer/proposal-submit/submit-proposal'

export default defineComponent({
  name: 'TaskCard',
  components: {
    AppIcon,
    AppTag,
  },
  props: {
    task: {
      type: Object as PropType<TaskPublicInfo>,
      required: true,
    },
  },
  setup(props) {
    const content = ref<HTMLDivElement | null>(null)
    const detailsTriggerHidden = ref(false)

    const router = useRouter()

    const { setTask } = useSubmitProposal()

    const taskAddedTimeFormatted = computed(() => getFormattedRelativeDate(props.task.addedTime))

    const currencyFormatted = computed(() => {
      const currencySign = getCurrencySign(props.task.budget?.currency) || ''
      return `${currencySign}${props.task.budget?.value}`
    })

    const platformLabels = computed(() => {
      const platformLabels = props.task.platforms.map(getTaskPlatformLabel).filter(Boolean)
      return platformLabels
    })

    const showDetails = () => {
      content.value?.classList.toggle('line-clamped')
      detailsTriggerHidden.value = true
    }

    const checkDescriptionVisibility = () => {
      const descriptionElement = content.value as HTMLParagraphElement
      const lineHeight = window.getComputedStyle(descriptionElement).getPropertyValue('line-height')
      const lineHeightInt = parseInt(lineHeight)

      if (descriptionElement.scrollHeight > lineHeightInt * 3) {
        descriptionElement.classList.remove('truncated')
      }
      if (descriptionElement.scrollHeight <= lineHeightInt * 3) {
        descriptionElement.classList.add('truncated')
      }
    }

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

    const goToTask = () => {
      setTask(props.task)
      router.push(`/i/tasks/${props.task.id}/propose`)
    }

    onMounted(() => {
      checkDescriptionVisibility()
      window.addEventListener('resize', checkDescriptionVisibility)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', checkDescriptionVisibility)
    })

    watch(
      () => props.task.description,
      () => {
        setTimeout(checkDescriptionVisibility)
      }
    )

    return {
      taskAddedTimeFormatted,
      currencyFormatted,
      platformLabels,
      moneySpentText,
      marketerRatingText,
      locationText,
      variables,
      content,
      detailsTriggerHidden,
      showDetails,
      goToTask,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/tasks-search/TaskCard';
</style>
