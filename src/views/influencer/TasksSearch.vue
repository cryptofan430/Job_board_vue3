<template>
  <main class="tasks-search">
    <h1 class="title">Find job</h1>

    <div class="wrapper">
      <div class="header">
        <TasksSearchBar />
        <div class="mobile-header-btn-container">
          <AppButton outlined class="full-width tasks-filter-show-sm-btn" @click="toggleFilterMenu">
            <div class="icon-btn-container">
              <AppIcon name="filter" :color="variables.cPrimary500" :fill="variables.cGrey000" />
              <span class="icon-btn-text">Filter</span>
            </div>
          </AppButton>
        </div>
        <div v-if="showFilter" class="tasks-mobile-filters">
          <TasksFilters filter-icon />
        </div>
      </div>

      <div class="main">
        <AppSkeleton v-if="isLoading" />

        <AppErrorBox v-else-if="isError" @clicked="refetchAllTasks"> tasks </AppErrorBox>

        <AppEmptyBox v-else-if="isLoaded && !tasks?.length" variant="primary">
          There are no tasks that meet search criteria
        </AppEmptyBox>

        <TasksList v-else />

        <div class="tasks-filter">
          <TasksFilters />
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import TasksList from '@/components/influencer/tasks-search/TasksList.vue'
import TasksFilters from '@/components/influencer/tasks-search/TasksFilters.vue'
import TasksSearchBar from '@/components/influencer/tasks-search/TasksSearchBar.vue'
import useTasksSearch from '@/components/influencer/tasks-search/task-search'
import AppButton from '@/components/common/AppButton.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppEmptyBox from '@/components/common/AppEmptyBox.vue'
import variables from '@/assets/variables'
import { scrollToPageTop } from '@/components/helpers/dom'

export default defineComponent({
  name: 'TasksSearch',
  components: {
    AppSkeleton,
    AppEmptyBox,
    AppErrorBox,
    TasksList,
    TasksFilters,
    TasksSearchBar,
    AppButton,
    AppIcon,
  },
  setup() {
    const { tasks, isLoaded, isLoading, isError, refetchAllTasks, watchPageLimits, watchFilters } = useTasksSearch()

    if (!isLoaded.value) {
      refetchAllTasks()
      scrollToPageTop()
    }

    watchPageLimits()
    watchFilters()

    const showFilter = ref(false)

    const toggleFilterMenu = () => {
      showFilter.value = !showFilter.value
    }

    return {
      tasks,
      isLoaded,
      isLoading,
      isError,
      variables,
      showFilter,
      refetchAllTasks,
      toggleFilterMenu,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/tasks-search/TasksSearch';
</style>
