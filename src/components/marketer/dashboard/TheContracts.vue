<template>
  <section class="contracts">
    <div class="title-with-button">
      <h2 class="contracts-title">Contracts</h2>
      <AppLink v-if="contracts?.length" to="/m/dashboard/contracts" outlined class="show-all-button-md">
        Show all
      </AppLink>
    </div>

    <AppLink v-if="contracts?.length" to="/m/dashboard/contracts" outlined class="show-all-button-sm">
      Show all
    </AppLink>

    <div class="contract-list">
      <AppSkeleton v-if="isLoading" />
      <AppErrorBox v-else-if="isError" @clicked="fetchContractFirstPage">contracts</AppErrorBox>

      <AppEmptyBox v-else-if="isLoaded && !contracts?.length"> There are no contracts at the moment </AppEmptyBox>

      <template v-else>
        <ContractListItem v-for="contract in contracts" :key="contract" :task-contract="contract" />
      </template>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import ContractListItem from './ContractListItem.vue'
import AppLink from '@/components/common/AppLink.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppEmptyBox from '@/components/common/AppEmptyBox.vue'
import useMarketerContracts from '@/components/marketer/dashboard/marketer-contract'
import { initialIItems } from '@/components/helpers/arrays'

export default defineComponent({
  name: 'TheContracts',
  components: {
    ContractListItem,
    AppErrorBox,
    AppSkeleton,
    AppEmptyBox,
    AppLink,
  },
  setup() {
    const { getMarketerContracts, isLoading, isError, isLoaded, fetchContractFirstPage } = useMarketerContracts()

    const displayContracts = computed(() => initialIItems(getMarketerContracts.value, 2))

    fetchContractFirstPage()

    return {
      contracts: displayContracts,
      isLoading,
      isError,
      isLoaded,
      fetchContractFirstPage,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/dashboard/TheContracts';
</style>
