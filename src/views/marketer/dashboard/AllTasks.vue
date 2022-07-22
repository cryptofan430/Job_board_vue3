<template>
  <section class="all-tasks">
    <h2 v-if="tasks?.length" class="tasks-text">All tasks</h2>

    <div class="list">
      <AppSkeleton v-if="isLoading" />

      <AppErrorBox v-else-if="isError" @clicked="refetchMarketerTasks">tasks</AppErrorBox>

      <AppEmptyBox v-else-if="isLoaded && !tasks?.length"> There are no tasks </AppEmptyBox>

      <template v-else>
        <TaskListItem v-for="task in tasks" :key="task.id" :task="task" />
      </template>
    </div>
  </section>

  <AppPagination
    v-if="isLoaded && tasks?.length"
    :per-page="perPage"
    :active-page="activePage"
    :count="tasksCount"
    @page-change="updatePage"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TaskListItem from '@/components/marketer/dashboard/TaskListItem.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppEmptyBox from '@/components/common/AppEmptyBox.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import useMarketerTasks from '@/components/marketer/dashboard/marketer-tasks'

export default defineComponent({
  name: 'AllTasks',
  components: {
    TaskListItem,
    AppErrorBox,
    AppSkeleton,
    AppEmptyBox,
    AppPagination,
  },
  setup() {
    const {
      tasks,
      tasksCount,
      perPage,
      activePage,
      isLoading,
      isLoaded,
      isError,
      refetchMarketerTasks,
      fetchMarketerTasksInitial,
      watchFilters,
      updatePage,
      watchPageLimits,
    } = useMarketerTasks()

    fetchMarketerTasksInitial()

    watchPageLimits()
    watchFilters()

    return {
      tasks,
      tasksCount,
      isLoading,
      isLoaded,
      isError,
      activePage,
      perPage,
      refetchMarketerTasks,
      updatePage,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/dashboard/AllTasks';
</style>
