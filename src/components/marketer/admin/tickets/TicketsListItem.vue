<template>
  <li class="tickets-list-item">
    <div class="tickets-content">
      <div class="ticket-content-info-container">
        <p class="ticket-description">{{ ticket.description }}</p>
        <p class="ticket-time">{{ dateFormatter }}</p>
      </div>

      <div class="menu-sm-actions" @focusin="preventClose" @focusout="triggerClose">
        <div class="dotted-button-wrapper">
          <AppDottedButton @click="toggleContextMenu" />
          <AppContextMenu v-if="contextMenuOpen" class="ticket-context-menu">
            <AppContextMenuItem :disabled="isTicketClosed" @click="closeTicket">Close&nbsp;Ticket</AppContextMenuItem>
          </AppContextMenu>
        </div>
      </div>

      <div class="button-actions">
        <AppButton size="sm" class="chat-button" :disabled="isTicketClosed && !ticket.joinedChat" @click="joinChat"
          >Chat</AppButton
        >
      </div>
    </div>
    <div class="tickets-aside">
      <div class="ticket-admin">
        <p class="ticket-admin-label">Admin</p>
        <p class="ticket-admin-name" :class="adminClasses">{{ adminText }}</p>
      </div>
      <div class="ticket-status">
        <p class="ticket-status-label">Status</p>
        <p class="ticket-status-value" :class="ticketStateClasses">{{ ticketStateText }}</p>
      </div>
    </div>
    <div class="menu-actions" @focusin="preventClose" @focusout="triggerClose">
      <div class="dotted-button-wrapper">
        <AppDottedButton @click="toggleContextMenu" />
        <AppContextMenu v-if="contextMenuOpen" class="ticket-context-menu">
          <AppContextMenuItem :disabled="isTicketClosed" @click="closeTicket">Close&nbsp;Ticket</AppContextMenuItem>
        </AppContextMenu>
      </div>
    </div>
  </li>
  <div class="button-sm-actions">
    <AppButton size="sm" class="chat-button" :disabled="isTicketClosed && !ticket.joinedChat" @click="joinChat"
      >Chat</AppButton
    >
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import AppDottedButton from '@/components/common/AppDottedButton.vue'
import AppContextMenu from '@/components/common/AppContextMenu.vue'
import AppContextMenuItem from '@/components/common/AppContextMenuItem.vue'
import { AdminTicketUiInfo, TicketState } from '@/types/tickets'
import { getMessageTimeFormatted } from '@/components/helpers/timeFormatter'

export default defineComponent({
  components: {
    AppButton,
    AppDottedButton,
    AppContextMenu,
    AppContextMenuItem,
  },
  props: {
    ticket: {
      type: Object as PropType<AdminTicketUiInfo>,
      required: true,
    },
  },
  emits: ['close-ticket', 'join-chat'],
  setup(props, { emit }) {
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

    const closePopupImmediate = () => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      contextMenuOpen.value = false
    }

    const dateFormatter = computed(() => getMessageTimeFormatted(props.ticket.createdDate))

    const closeTicket = () => {
      closePopupImmediate()
      emit('close-ticket', props.ticket)
    }

    const joinChat = () => {
      emit('join-chat', props.ticket)
    }

    const isTicketOpen = computed(() => props.ticket.state === TicketState.OPEN)
    const isTicketClosed = computed(() => props.ticket.state === TicketState.CLOSED)
    const ticketStateText = computed(() => {
      if (isTicketOpen.value) return 'open'
      if (isTicketClosed.value) return 'closed'
      return 'no state'
    })
    const ticketStateClasses = computed(() => {
      if (isTicketOpen.value) return '--new'
      if (isTicketClosed.value) return '--closed'
      return ''
    })

    const adminText = computed(() => {
      if (props.ticket.isAdminInChat && props.ticket.joinedChat) return 'me'
      if (props.ticket.isAdminInChat) return 'other admin'
      return 'no admin'
    })
    const adminClasses = computed(() => {
      if (!props.ticket.isAdminInChat) return '--not-selected'
      return ''
    })

    return {
      isTicketClosed,
      contextMenuOpen,
      dateFormatter,
      ticketStateText,
      adminText,
      ticketStateClasses,
      adminClasses,
      toggleContextMenu,
      triggerOpen,
      triggerClose,
      preventClose,
      closeTicket,
      closePopupImmediate,
      joinChat,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/admin/tickets/TicketsListItem';
</style>
