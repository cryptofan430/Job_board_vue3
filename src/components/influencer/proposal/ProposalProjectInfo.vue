<template>
  <div class="project-details">
    <div class="project-bar">
      <p class="name">
        {{ task.title }}
      </p>

      <div class="rating">
        <span class="budget"> Budget: {{ currencyFormatted }} </span>
      </div>
    </div>

    <p class="date">
      {{ proposalDate }}
    </p>

    <p class="content">
      {{ task.description }}
    </p>

    <div class="platforms">
      <p class="platforms-text">Platform:</p>

      <AppTag v-for="platform in platformLabels" :key="platform" outlined>
        {{ platform }}
      </AppTag>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

import AppTag from '@/components/common/AppTag.vue'
import variables from '@/assets/variables'
import { TaskPublicInfo } from '@/types/tasks.model'
import { getFormattedRelativeDate } from '@/components/helpers/timeFormatter'
import { getTaskPlatformLabel } from '@/components/helpers/platforms'
import { getCurrencySign } from '@/components/helpers/currencyFormatter'

export default defineComponent({
  name: 'ProposalProjectInfo',
  components: {
    AppTag,
  },
  props: {
    task: {
      type: Object as PropType<TaskPublicInfo>,
      required: true,
    },
  },
  setup(props) {
    const proposalDate = computed(() => getFormattedRelativeDate(props.task.addedTime))
    const platformLabels = computed(() => props.task.platforms.map(getTaskPlatformLabel))
    const currencyFormatted = computed(() => {
      const currencySign = getCurrencySign(props.task.budget?.currency) || ''
      return `${currencySign}${props.task.budget?.value}`
    })

    return {
      proposalDate,
      platformLabels,
      variables,
      currencyFormatted,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/proposal/ProposalProjectInfo';
</style>
