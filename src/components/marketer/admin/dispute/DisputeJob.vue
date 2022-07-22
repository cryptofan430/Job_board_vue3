<template>
  <AppExpandMenu>
    <template #header>Job description</template>
    <template #default>
      <AppSkeleton v-if="isLoading" />
      <AppErrorBox v-else-if="isError" @clicked="initDispute">dispute</AppErrorBox>
      <template v-else>
        <p class="job-time">added {{ taskDateFormatted }}</p>
        <p class="job-description">
          {{ getAdminDispute?.contractWithTask?.task?.description }}
        </p>
        <div class="platforms">
          <p class="platforms-text">Platform:</p>
          <AppTag v-for="platform in platformLabels" :key="platform" outlined>
            {{ platform }}
          </AppTag>
        </div>
      </template>
    </template>
  </AppExpandMenu>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import AppExpandMenu from '@/components/common/AppExpandMenu.vue'
import AppTag from '@/components/common/AppTag.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import useAdminDispute from './dispute'
import { getMessageTimeFormatted } from '@/components/helpers/timeFormatter'
import { getTaskPlatformLabel } from '@/components/helpers/platforms'

export default defineComponent({
  components: {
    AppExpandMenu,
    AppTag,
    AppErrorBox,
    AppSkeleton,
  },
  setup() {
    const { getAdminDispute, isLoading, isError, initDispute } = useAdminDispute()

    const taskDateFormatted = computed(() => {
      if (getAdminDispute.value?.contractWithTask?.task?.addedTime) {
        return getMessageTimeFormatted(getAdminDispute.value?.contractWithTask?.task?.addedTime)
      }
      return ''
    })

    const platformLabels = computed(
      () =>
        getAdminDispute?.value?.contractWithTask.task.platforms.map((platform) => getTaskPlatformLabel(platform)) || []
    )

    return {
      getAdminDispute,
      taskDateFormatted,
      isLoading,
      isError,
      initDispute,
      platformLabels,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/admin/dispute/DisputeJob.scss';
</style>
