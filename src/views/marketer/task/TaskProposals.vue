<template>
  <section class="task-proposals" :class="classList">
    <AppErrorBox v-if="isError" @clicked="refetchProposals">proposals</AppErrorBox>

    <AppSkeleton v-else-if="isLoading" />

    <AppEmptyBox v-else-if="isLoaded && !proposals.length"> There are no proposals </AppEmptyBox>

    <template v-else>
      <div class="proposals-list-header">
        <TaskProposalsSort />
      </div>

      <div class="proposals-list">
        <TaskProposalsListItem
          v-for="proposal of proposals"
          :key="proposal.id"
          :proposal="proposal"
          :task-id="taskId"
          :task="activeTask"
        />
      </div>
    </template>
  </section>

  <AppPagination
    v-if="isLoaded && proposals?.length"
    :count="proposalsCount"
    :per-page="proposalsPerPage"
    :active-page="activePage"
    @page-change="updatePage"
  />
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import AppEmptyBox from '@/components/common/AppEmptyBox.vue'
import TaskProposalsSort from '@/components/marketer/task/task-proposals/TaskProposalsSort.vue'
import TaskProposalsListItem from '@/components/marketer/task/task-proposals/TaskProposalsListItem.vue'
import useMarketerTaskProposals from '@/components/marketer/task/task-proposals/marketer-task-proposals'
import { setTitle } from '@/components/helpers/dom'

export default defineComponent({
  name: 'TaskProposals',
  components: {
    AppErrorBox,
    AppEmptyBox,
    AppSkeleton,
    AppPagination,
    TaskProposalsSort,
    TaskProposalsListItem,
  },
  setup() {
    const {
      activeTask,
      proposals,
      isLoading,
      isLoaded,
      isError,
      activePage,
      proposalsPerPage,
      proposalsCount,
      taskId,
      updatePage,
      refetchProposals,
      initMarketerTaskProposals,
      watchFilters,
      watchPageLimits,
    } = useMarketerTaskProposals()

    initMarketerTaskProposals()

    watchPageLimits()
    watchFilters()

    const classList = computed(() => {
      const emptynessClass = isLoaded.value && !proposals?.value?.length ? '--empty' : ''

      return `${emptynessClass}`
    })

    watch(
      activeTask,
      (task) => {
        if (task) setTitle('Freelance Influence | Proposals Of Task ' + task.title)
      },
      { immediate: true }
    )

    return {
      classList,
      proposals,
      isLoading,
      isLoaded,
      isError,
      activePage,
      proposalsPerPage,
      proposalsCount,
      activeTask,
      taskId,
      updatePage,
      refetchProposals,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/task/task-proposals/TaskProposals';
</style>
