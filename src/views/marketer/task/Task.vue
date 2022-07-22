<template>
  <main class="task">
    <h1 v-if="getSelectedTask" class="task-name">{{ getSelectedTask.title }}</h1>

    <div class="page-content">
      <TaskNav />
      <router-view />
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, watch } from 'vue'
import TaskNav from '@/components/marketer/task/TaskNav.vue'
import useTaskDetails from '@/components/marketer/task/task-details'
import useTaskStore from '@/store/task'
import { useRouter } from 'vue-router'
import { setTitle } from '@/components/helpers/dom'

export default defineComponent({
  name: 'Task',
  components: { TaskNav },
  setup() {
    const { loadTask, reset } = useTaskDetails()
    const { getSelectedTask, setSelectedTask } = useTaskStore()
    const router = useRouter()

    if (getSelectedTask.value?.id !== router.currentRoute.value.params?.taskId) setSelectedTask(null)
    if (!getSelectedTask.value) loadTask()

    const checkIsMyTask = () => {
      if (getSelectedTask.value && getSelectedTask.value.addedByMe === false) router.push('/')
    }

    checkIsMyTask()

    watch(getSelectedTask, checkIsMyTask)
    watch(
      getSelectedTask,
      (task) => {
        if (task) setTitle('Freelance Influence | Task ' + task.title)
      },
      { immediate: true }
    )

    onUnmounted(reset)

    return { getSelectedTask }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/task/Task';
</style>
