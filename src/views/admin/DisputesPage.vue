<template>
  <main class="disputes-page">
    <div class="disputes-page-container">
      <h1 class="disputes-page-header">Disputes</h1>

      <AppButton outlined class="full-width disputes-filter-show-sm-btn" @click="toggleFilterMenu">
        <div class="icon-btn-container">
          <AppIcon name="filter" />
          <span class="icon-btn-text">Filter</span>
        </div>
      </AppButton>

      <div v-if="showFilter" class="disputes-mobile-filters">
        <DisputesFilters filter-icon />
      </div>

      <AppSkeleton v-if="isLoading" class="disputes-state" />
      <AppErrorBox v-else-if="isError" class="disputes-state" @clicked="refetchDisputes">disputes</AppErrorBox>
      <AppEmptyBox v-else-if="!getAdminDisputes?.length" class="disputes-state" variant="primary"
        >There are no disputes by the given filters</AppEmptyBox
      >

      <template v-else>
        <ul class="disputes-list">
          <DisputesListItem
            v-for="dispute in getAdminDisputes"
            :key="dispute.id"
            :dispute="dispute"
            @join-dispute-chat="joinDisputeChat"
          />
        </ul>
        <AppPagination
          :active-page="activePage"
          :count="getAdminDisputeCount"
          :per-page="disputePerPage"
          @page-change="updatePage"
        />
      </template>
    </div>

    <div class="disputes-filters">
      <DisputesFilters />
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import DisputesListItem from '@/components/marketer/admin/disputes/DisputesListItem.vue'
import DisputesFilters from '@/components/marketer/admin/disputes/DisputesFilters.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppEmptyBox from '@/components/common/AppEmptyBox.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import useAdminDisputes from '@/components/marketer/admin/disputes/disputes'

export default defineComponent({
  components: {
    DisputesListItem,
    DisputesFilters,
    AppPagination,
    AppSkeleton,
    AppErrorBox,
    AppEmptyBox,
    AppButton,
  },
  setup() {
    const {
      getAdminDisputes,
      getAdminDisputeCount,
      activePage,
      isLoading,
      isError,
      isLoaded,
      disputePerPage,
      watchPageLimits,
      watchFilters,
      refetchDisputes,
      updatePage,
      joinDisputeChat,
    } = useAdminDisputes()

    const showFilter = ref(false)

    const toggleFilterMenu = () => {
      showFilter.value = !showFilter.value
    }

    refetchDisputes()
    watchPageLimits()
    watchFilters()

    return {
      getAdminDisputes,
      getAdminDisputeCount,
      activePage,
      isLoading,
      isLoaded,
      isError,
      disputePerPage,
      showFilter,
      refetchDisputes,
      updatePage,
      joinDisputeChat,
      toggleFilterMenu,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/admin/disputes/DisputesPage';
</style>
