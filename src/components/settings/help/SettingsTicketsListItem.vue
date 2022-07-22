<template>
  <li class="settings-ticket-list-item">
    <div class="ticket-content">
      <div class="ticket-data">
        <p class="ticket-text">{{ ticket.description }}</p>
        <p class="ticket-time">{{ formattedCreated }}.</p>
      </div>
      <div class="actions">
        <AppLink
          size="sm"
          :to="{ name: 'SelectedChat', params: { chatId: ticket.chatId } }"
          :disabled="ticket.closeInProgress"
          >Chat</AppLink
        >
      </div>
    </div>
    <div class="post-content" @focusin="preventClose" @focusout="triggerClose">
      <AppDottedButton class="dotted-button-content" @click="toggleContextMenu" />
      <AppContextMenu v-if="contextMenuOpen" class="dispute-context-menu">
        <AppContextMenuItem :disabled="isTicketClosed" @click="closeTicket">Close&nbsp;Ticket</AppContextMenuItem>
      </AppContextMenu>
    </div>
  </li>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import AppLink from '@/components/common/AppLink.vue'
import AppDottedButton from '@/components/common/AppDottedButton.vue'
import AppContextMenu from '@/components/common/AppContextMenu.vue'
import AppContextMenuItem from '@/components/common/AppContextMenuItem.vue'
import { TicketState, TicketUiPublicInfo } from '@/types/tickets'
import { getFormattedRelativeDate } from '@/components/helpers/timeFormatter'

export default defineComponent({
  components: {
    AppLink,
    AppDottedButton,
    AppContextMenu,
    AppContextMenuItem,
  },
  props: {
    ticket: {
      type: Object as PropType<TicketUiPublicInfo>,
      required: true,
    },
  },
  emits: ['close-ticket'],
  setup(props, { emit }) {
    const isTicketClosed = computed(() => props.ticket.state === TicketState.CLOSED)

    const contextMenuOpen = ref(false)
    let timer: number | null = null

    const toggleContextMenu = () => {
      contextMenuOpen.value = !contextMenuOpen.value
    }
    const triggerOpen = () => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      contextMenuOpen.value = true
    }
    const triggerClose = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        contextMenuOpen.value = false
      })
    }
    const preventClose = () => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }
    const closeImmediate = () => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      contextMenuOpen.value = false
    }

    const closeTicket = () => {
      closeImmediate()
      emit('close-ticket', props.ticket)
    }

    const formattedCreated = computed(() => getFormattedRelativeDate(props.ticket.createdDate))

    return {
      formattedCreated,
      contextMenuOpen,
      isTicketClosed,
      toggleContextMenu,
      triggerOpen,
      triggerClose,
      preventClose,
      closeTicket,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/help/SettingsTicketsListItem';
</style>
