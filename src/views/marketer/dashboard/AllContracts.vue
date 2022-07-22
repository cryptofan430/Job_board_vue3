<template>
  <section class="all-contracts">
    <h2 class="contracts-text">All contracts</h2>

    <div class="contract-list">
      <AppSkeleton v-if="isLoading" />
      <AppErrorBox v-else-if="isError" @clicked="refetchContracts">contracts</AppErrorBox>

      <AppEmptyBox v-else-if="isLoaded && !getMarketerContracts?.length">
        There are no contracts at the moment
      </AppEmptyBox>

      <template v-else>
        <template v-for="contract in getMarketerContracts" :key="contract.contract?.id">
          <ContractListItem :task-contract="contract" />
        </template>
      </template>
    </div>
  </section>

  <AppPagination
    :active-page="activePage"
    :count="getMarketerContractsCount"
    :per-page="contractsPerPage"
    @page-change="updatePage"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useMarketerContracts from '@/components/marketer/dashboard/marketer-contract'
import ContractListItem from '@/components/marketer/dashboard/ContractListItem.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import AppEmptyBox from '@/components/common/AppEmptyBox.vue'

export default defineComponent({
  name: 'AllContracts',
  components: {
    ContractListItem,
    AppErrorBox,
    AppSkeleton,
    AppEmptyBox,
    AppPagination,
  },
  setup() {
    const {
      getMarketerContracts,
      getMarketerContractsCount,
      contractsPerPage,
      activePage,
      isLoading,
      isError,
      isLoaded,
      watchPageLimits,
      watchFilters,
      fetchContractsInitial,
      refetchContracts,
      updatePage,
    } = useMarketerContracts()

    fetchContractsInitial()
    watchPageLimits()
    watchFilters()

    return {
      getMarketerContracts,
      getMarketerContractsCount,
      contractsPerPage,
      activePage,
      isLoaded,
      isLoading,
      isError,
      refetchContracts,
      updatePage,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/dashboard/AllContracts';
</style>
