<template>
  <main class="contracts">
    <h2 class="title">All contracts</h2>

    <div class="wrapper">
      <AppSkeleton v-if="isLoading" />
      <AppErrorBox v-else-if="isError" @clicked="refetchContracts">conracts</AppErrorBox>

      <AppEmptyBox v-else-if="isLoaded && !getInfluencerContracts?.length"> There are no contracts </AppEmptyBox>

      <ul v-else class="list">
        <ContractItem
          v-for="taskContract in getInfluencerContracts"
          :key="taskContract?.contract?.id"
          :task-contract="taskContract"
        />
      </ul>
    </div>

    <AppPagination
      v-if="isLoaded && getInfluencerContracts?.length"
      :count="getInfluencerContractsCount"
      :per-page="contractsPerPage"
      :active-page="activePage"
      @page-change="updatePage"
    />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ContractItem from '@/components/influencer/contracts/ContractItem.vue'
import useInfluencerContracts from '@/components/influencer/tasks/contracts'
import AppPagination from '@/components/common/AppPagination.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppEmptyBox from '@/components/common/AppEmptyBox.vue'

export default defineComponent({
  name: 'Contracts',
  components: {
    AppPagination,
    AppSkeleton,
    AppErrorBox,
    AppEmptyBox,
    ContractItem,
  },
  setup() {
    const {
      getInfluencerContracts,
      getInfluencerContractsCount,
      contractsPerPage,
      activePage,
      isLoading,
      isLoaded,
      isError,
      refetchContracts,
      updatePage,
      watchPageLimits,
      watchFilters,
    } = useInfluencerContracts()

    refetchContracts()

    watchPageLimits()
    watchFilters()

    return {
      getInfluencerContracts,
      getInfluencerContractsCount,
      contractsPerPage,
      activePage,
      isLoading,
      isLoaded,
      isError,
      refetchContracts,
      updatePage,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/influencer/contracts/Contracts';
</style>
