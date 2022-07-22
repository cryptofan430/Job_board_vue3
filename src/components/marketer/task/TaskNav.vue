<template>
  <div>
    <div class="desktop-task-nav">
      <nav class="task-nav">
        <router-link class="link" :to="`/m/tasks/${taskId}`">Details</router-link>

        <router-link class="link" :to="`/m/tasks/${taskId}/proposals`">
          Proposals
          <span class="proposals-count">({{ proposalsCount }})</span>
        </router-link>

        <router-link class="link" :to="`/m/tasks/${taskId}/contracts`">Contracts</router-link>

        <router-link class="link" :to="`/m/tasks/${taskId}/invitations`">Invitations</router-link>
      </nav>
    </div>
    <div class="mobile-task-nav">
      <AppNavigation :values="OPTIONS" class="task-nav" />
    </div>
  </div>
</template>

<script lang="ts">
import useTaskStore from '@/store/task'
import { computed, defineComponent, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import useMarketerTaskContracts from './task-contracts/task-contracts'
import useMarketerTaskProposals from './task-proposals/marketer-task-proposals'
import AppNavigation from '@/components/common/AppNavigation.vue'

export default defineComponent({
  name: 'TaskNav',
  components: {
    AppNavigation,
  },
  setup() {
    const router = useRouter()
    const taskId = router.currentRoute.value.params.taskId as string
    const { getSelectedTask } = useTaskStore()
    const { resetTaskContractsState } = useMarketerTaskContracts()
    const { resetMarketerTaskProposalsState } = useMarketerTaskProposals()
    const proposalsCount = computed(() => getSelectedTask.value?.proposalCount || 0)

    const OPTIONS = [
      {
        title: 'Details',
        slug: 'details',
        url: `/m/tasks/${taskId}`,
      },
      {
        title: 'Proposals',
        slug: 'proposals',
        url: `/m/tasks/${taskId}/proposals`,
      },
      {
        title: 'Contracts',
        slug: 'contracts',
        url: `/m/tasks/${taskId}/contracts`,
      },
      {
        title: 'Invitations',
        slug: 'invitations',
        url: `/m/tasks/${taskId}/invitations`,
      },
    ]

    onBeforeUnmount(() => {
      resetTaskContractsState()
      resetMarketerTaskProposalsState()
    })

    return {
      taskId,
      proposalsCount,
      OPTIONS,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/task/TaskNav';
</style>
