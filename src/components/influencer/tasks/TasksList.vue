<template>
  <div class="list">
    <TaskListItem
      v-for="taskContract in getInfluencerContracts"
      :key="taskContract.contract?.id"
      :task-contract="taskContract"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TaskListItem from '@/components/influencer/tasks/TaskItem.vue'
import useInfluencerContracts from '@/components/influencer/tasks/contracts'

export default defineComponent({
  name: 'TasksList',
  components: {
    TaskListItem,
  },
  setup() {
    const { getInfluencerContracts } = useInfluencerContracts()

    return {
      getInfluencerContracts,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/tasks/TasksList';
</style>
