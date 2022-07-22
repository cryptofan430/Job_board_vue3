<template>
  <div>
    <section class="tasks">
      <div class="title-with-button">
        <h2 class="title">Tasks</h2>
        <AppLink v-if="getMyTasks?.length" to="/m/dashboard/tasks" outlined class="show-all-button-md">
          Show all
        </AppLink>
      </div>

      <div class="list">
        <template v-if="!isLoading && !showLoadingError && getMyTasks?.length">
          <TaskListItem v-for="task in getMyTasks" :key="task.id" :task="task" />
        </template>

        <AppEmptyBox v-else-if="!isLoading && !showLoadingError && !getMyTasks?.length">
          There are no tasks at the moment
        </AppEmptyBox>

        <AppErrorBox v-else-if="showLoadingError" @clicked="loadTasks">tasks</AppErrorBox>

        <AppSkeleton v-else />
      </div>
    </section>
    <AppLink v-if="getMyTasks?.length" to="/m/dashboard/tasks" outlined class="show-all-button-sm">Show all</AppLink>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import useTaskController from '@/middleware/controllers/useTaskController'
import useMyTasksStore from '@/store/my-tasks'
import TaskListItem from './TaskListItem.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppLink from '@/components/common/AppLink.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppEmptyBox from '@/components/common/AppEmptyBox.vue'

export default defineComponent({
  name: 'TheTasks',
  components: {
    TaskListItem,
    AppErrorBox,
    AppEmptyBox,
    AppLink,
    AppSkeleton,
  },
  setup() {
    const { fetchMyTasks } = useTaskController()
    const { getMyTasks } = useMyTasksStore()

    const isLoading = ref(false)
    const showLoadingError = ref(false)

    const loadTasks = () => {
      isLoading.value = true
      showLoadingError.value = false

      fetchMyTasks({ limit: 2 })
        .catch(() => {
          showLoadingError.value = true
        })
        .finally(() => {
          isLoading.value = false
        })
    }

    if (!getMyTasks.value.length) {
      isLoading.value = true
      loadTasks()
    }

    return {
      getMyTasks,
      isLoading,
      showLoadingError,
      loadTasks,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/dashboard/TheTasks';
</style>
