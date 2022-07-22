<template>
  <div class="task-list-item">
    <div class="link-with-time">
      <router-link :to="`/m/tasks/${task.id}`" class="link">
        <span @click="setSelectedTask(task)">{{ task.title }}</span>
      </router-link>

      <span class="created-time">created {{ timeFormatted }} ago</span>
    </div>

    <span class="proposal-count">{{ task.proposalCount }} {{ proposalsText }}</span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { getTimeEllapsed } from '@/components/helpers/timeFormatter'
import { TaskPublicInfo } from '@/types/tasks.model'
import useTaskStore from '@/store/task'

export default defineComponent({
  name: 'TaskListItem',
  props: {
    task: {
      type: Object as PropType<TaskPublicInfo>,
      required: true,
    },
  },
  setup(props) {
    const timeEllapsed = getTimeEllapsed(props.task.addedTime)
    const { setSelectedTask } = useTaskStore()

    const proposalsText = computed(() => (props.task.proposalCount === 1 ? 'Proposal' : 'Proposals'))

    return {
      timeFormatted: `${timeEllapsed.time} ${timeEllapsed.unit}`,
      setSelectedTask,
      proposalsText,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/dashboard/TaskListItem';
</style>
