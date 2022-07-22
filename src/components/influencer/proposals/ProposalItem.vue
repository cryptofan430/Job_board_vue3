<template>
  <div class="proposal">
    <router-link :to="{ name: 'Proposal', params: { taskId: task.id } }">
      <p class="name">
        {{ task.title }}
      </p>
    </router-link>

    <p class="created">
      {{ proposalAddedTimeFormatted }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import { ProposalPublicInfo } from '@/types/proposal.model'
import { getFormattedRelativeDate } from '@/components/helpers/timeFormatter'
import { TaskPublicInfo } from '@/types/tasks.model'

export default defineComponent({
  props: {
    proposal: {
      type: Object as PropType<ProposalPublicInfo>,
      required: true,
    },
    task: {
      type: Object as PropType<TaskPublicInfo>,
      required: true,
    },
  },
  setup(props) {
    const proposalAddedTimeFormatted = computed(() => getFormattedRelativeDate(props.proposal.addedTime))

    return { proposalAddedTimeFormatted }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/proposals/ProposalItem';
</style>
