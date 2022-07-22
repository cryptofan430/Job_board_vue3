<template>
  <div class="tasks-list">
    <TaskCard v-for="task in tasks" :key="task.id" :task="task" />

    <AppPagination
      :per-page="tasksPerPage"
      :count="tasksCount"
      :active-page="activePage"
      :disabled="isLoading"
      @page-change="updatePage"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TaskCard from '@/components/influencer/tasks-search/TaskCard.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import useTasksSearch from '@/components/influencer/tasks-search/task-search'

export default defineComponent({
  components: {
    TaskCard,
    AppPagination,
  },
  setup() {
    const { tasksCount, tasks, activePage, isLoading, tasksPerPage, updatePage } = useTasksSearch()

    return {
      tasks,
      isLoading,
      tasksPerPage,
      activePage,
      tasksCount,
      updatePage,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/tasks-search/TasksList';
</style>
