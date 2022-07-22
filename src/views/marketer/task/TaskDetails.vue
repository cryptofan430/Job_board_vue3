<template>
  <div>
    <section class="task-details">
      <AppErrorBox v-if="showLoadingError" @clicked="loadTask">task</AppErrorBox>

      <AppSkeleton v-else-if="isLoading" />

      <template v-else>
        <div class="details-wrapper">
          <AppLink
            v-if="getSelectedTask?.addedByMe && !getSelectedTask?.hasContractCreated"
            :to="`/m/tasks/${taskId}/edit-task`"
            outlined
            >Edit a task</AppLink
          >

          <p class="description">{{ getSelectedTask?.description }}</p>
          <span class="created-time">created {{ timeEllapsed.time }} {{ timeEllapsed.unit }} ago</span>

          <div class="platforms">
            <span class="platforms-text">Platform:</span>
            <AppTag v-for="platform in getSelectedTask?.platforms || []" :key="platform">
              {{ platform.toLowerCase() }}
            </AppTag>
          </div>
        </div>

        <div class="cash-wrapper">
          <span class="cash">{{ cashText }}</span>
        </div>
      </template>
    </section>
    <div class="mobile-btn">
      <AppLink
        v-if="getSelectedTask?.addedByMe && !getSelectedTask?.hasContractCreated"
        :to="`/m/tasks/${taskId}/edit-task`"
        outlined
        >Edit a task</AppLink
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, watchEffect } from 'vue'
import AppTag from '@/components/common/AppTag.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import { getTimeEllapsed } from '@/components/helpers/timeFormatter'
import { getCurrencySign } from '@/components/helpers/currencyFormatter'
import useTaskDetails from '@/components/marketer/task/task-details'
import AppLink from '@/components/common/AppLink.vue'
import { useRouter } from 'vue-router'
import useTaskStore from '@/store/task'
import { setTitle } from '@/components/helpers/dom'

export default defineComponent({
  name: 'TaskDetails',
  components: {
    AppTag,
    AppErrorBox,
    AppSkeleton,
    AppLink,
  },
  setup() {
    const { loadTask, isLoading, showLoadingError } = useTaskDetails()

    const { getSelectedTask } = useTaskStore()

    const router = useRouter()

    const taskId = router.currentRoute.value.params.taskId as string

    const timeEllapsed = ref(getTimeEllapsed())

    watchEffect(() => {
      timeEllapsed.value = getTimeEllapsed(getSelectedTask.value?.addedTime)
    })

    const cashText = ref('')

    watchEffect(() => {
      if (getSelectedTask.value) {
        cashText.value = `
          ${getCurrencySign(getSelectedTask.value.budget.currency)}${getSelectedTask.value.budget.value}
        `
      }
    })
    watch(
      getSelectedTask,
      (task) => {
        if (task) setTitle('Freelance Influence | Details Of Task ' + task.title)
      },
      { immediate: true }
    )

    return {
      getSelectedTask,
      timeEllapsed,
      cashText,
      isLoading,
      showLoadingError,
      loadTask,
      taskId,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/task/TaskDetails';
</style>
