<template>
  <section class="task-contracts" :class="classList">
    <AppErrorBox v-if="isError" @clicked="refetchContracts">contracts</AppErrorBox>

    <AppSkeleton v-else-if="isLoading" />

    <AppEmptyBox v-else-if="isLoaded && !getMarketerContracts?.length"> There are no contracts </AppEmptyBox>

    <template v-else>
      <div class="task-contracts-list">
        <TaskContractsListItem
          v-for="contract in getMarketerContracts"
          :key="contract.contract?.id"
          :contract="contract"
        />
      </div>
    </template>
  </section>

  <AppPagination
    v-if="isLoaded && getMarketerContracts?.length"
    :count="getMarketerContractsCount"
    :per-page="contractsPerPage"
    :active-page="activePage"
    @page-change="updatePage"
  />
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue'
import useMarketerTaskContracts from '@/components/marketer/task/task-contracts/task-contracts'
import TaskContractsListItem from '@/components/marketer/task/task-contracts/TaskContractsListItem.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppEmptyBox from '@/components/common/AppEmptyBox.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import { setTitle } from '@/components/helpers/dom'
import useTaskStore from '@/store/task'

export default defineComponent({
  name: 'TaskContracts',
  components: {
    TaskContractsListItem,
    AppErrorBox,
    AppSkeleton,
    AppEmptyBox,
    AppPagination,
  },
  setup() {
    const {
      getMarketerContracts,
      getMarketerContractsCount,
      isLoading,
      isError,
      isLoaded,
      activePage,
      contractsPerPage,
      initMarketerTaskContracts,
      refetchContracts,
      updatePage,
      watchPageLimits,
      watchFilters,
    } = useMarketerTaskContracts()
    const { getSelectedTask } = useTaskStore()

    initMarketerTaskContracts()

    watchPageLimits()
    watchFilters()

    const classList = computed(() => {
      const emptynessClass = isLoaded.value && !getMarketerContracts?.value?.length ? '--empty' : ''

      return `${emptynessClass}`
    })
    watch(
      getSelectedTask,
      (task) => {
        if (task) setTitle('Freelance Influence | Contracts Of Task ' + task.title)
      },
      { immediate: true }
    )

    return {
      classList,
      getMarketerContracts,
      getMarketerContractsCount,
      isLoading,
      isError,
      isLoaded,
      activePage,
      contractsPerPage,
      refetchContracts,
      updatePage,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/task/TaskContracts';
</style>
