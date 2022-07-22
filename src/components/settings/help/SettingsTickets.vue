<template>
  <div class="settings-tickets">
    <section class="tickets-section">
      <h2 class="ticket-section-header">Open Tickets</h2>
      <ul class="settings-tickets-list">
        <SettingsTicketListItem
          v-for="ticket in getSettingsTickets"
          :key="ticket.id"
          :ticket="ticket"
          @close-ticket="closeTicket"
        />
      </ul>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SettingsTicketListItem from '@/components/settings/help/SettingsTicketsListItem.vue'
import useSettingsTickets from './settings-tickets'

export default defineComponent({
  components: {
    SettingsTicketListItem,
  },
  setup() {
    const { getSettingsTickets, closeTicket } = useSettingsTickets()

    return {
      getSettingsTickets,
      closeTicket,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/help/SettingsTickets';
</style>
