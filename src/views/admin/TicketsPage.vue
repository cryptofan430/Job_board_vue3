<template>
  <main class="tickets-page">
    <div class="tickets-page-ticket">
      <h1 class="tickets-page-header">Tickets</h1>

      <AppButton outlined class="full-width tickets-filter-show-sm-btn" @click="toggleFilterMenu">
        <div class="icon-btn-container">
          <AppIcon name="filter" />
          <span class="icon-btn-text">Filter</span>
        </div>
      </AppButton>

      <div v-if="showFilter" class="tickets-mobile-filters">
        <TicketsFilters filter-icon />
      </div>

      <AppErrorBox v-if="isError" class="tickets-state" @clicked="refetchTickets">tickets</AppErrorBox>
      <AppSkeleton v-else-if="isLoading" class="tickets-state" />
      <AppEmptyBox v-else-if="!getAdminTickets?.length" variant="primary" class="tickets-state"
        >No tickets by the given filters</AppEmptyBox
      >

      <template v-else>
        <ul class="tickets-list">
          <TicketsListItem
            v-for="ticket in getAdminTickets"
            :key="ticket.id"
            :ticket="ticket"
            @close-ticket="closeTicket"
            @join-chat="joinTicketChat"
          />
        </ul>

        <AppPagination
          :active-page="activePage"
          :count="getAdminTicketCount"
          :per-page="ticketPerPage"
          @page-change="updatePage"
        />
      </template>
    </div>
    <div class="tickets-filters">
      <TicketsFilters />
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import TicketsFilters from '@/components/marketer/admin/tickets/TicketsFilters.vue'
import TicketsListItem from '@/components/marketer/admin/tickets/TicketsListItem.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppEmptyBox from '@/components/common/AppEmptyBox.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import useAdminTickets from '@/components/marketer/admin/tickets/admin-tickets'

export default defineComponent({
  components: {
    TicketsFilters,
    TicketsListItem,
    AppPagination,
    AppErrorBox,
    AppSkeleton,
    AppEmptyBox,
    AppButton,
    AppIcon,
  },
  setup() {
    const {
      getAdminTickets,
      isLoaded,
      isError,
      isLoading,
      getAdminTicketCount,
      ticketPerPage,
      activePage,
      closeTicket,
      refetchTickets,
      watchPageLimits,
      watchFilters,
      updatePage,
      joinTicketChat,
    } = useAdminTickets()

    const showFilter = ref(false)

    const toggleFilterMenu = () => {
      showFilter.value = !showFilter.value
    }

    refetchTickets()
    watchPageLimits()
    watchFilters()

    return {
      getAdminTickets,
      getAdminTicketCount,
      isLoaded,
      isLoading,
      activePage,
      isError,
      ticketPerPage,
      showFilter,
      refetchTickets,
      updatePage,
      closeTicket,
      joinTicketChat,
      toggleFilterMenu,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/admin/tickets/TicketsPage';
</style>
