<template>
  <li class="disputes-list-item">
    <div class="disputes-content">
      <div class="dispute-content-info-container">
        <h2 class="project-name">{{ dispute.projectName }}</h2>
        <p class="milestone-name">{{ dispute.milestoneName }}</p>
        <p class="project-time">{{ '15 minutes ago' }}</p>
      </div>
      <div class="menu-sm-actions" @focusin="preventClose" @focusout="triggerClose">
        <div class="dotted-button-wrapper">
          <AppDottedButton @click="toggleContextMenu" />
          <AppContextMenu v-if="contextMenuOpen" class="dispute-context-menu">
            <AppContextMenuItem>Close&nbsp;Dispute</AppContextMenuItem>
          </AppContextMenu>
        </div>
      </div>
      <div class="button-actions">
        <AppLink
          size="sm"
          outlined
          :to="{
            name: 'AdminSingleDisputePage',
            params: {
              id: dispute.id,
            },
          }"
          >Open</AppLink
        >
        <AppButton class="chat-button" size="sm" @click="joinDisputeChat">Chat</AppButton>
      </div>
    </div>

    <div class="disputes-aside">
      <div class="dispute-admin">
        <p class="dispute-admin-label">Admin</p>
        <p class="dispute-admin-name" :class="adminClasses">{{ adminText }}</p>
      </div>
      <div class="dispute-status">
        <p class="dispute-status-label">Status:</p>
        <p class="dispute-status-value" :class="disputeStateClasses">{{ disputeStateText }}</p>
      </div>
    </div>
    <div class="menu-actions" @focusin="preventClose" @focusout="triggerClose">
      <div class="dotted-button-wrapper">
        <AppDottedButton @click="toggleContextMenu" />
        <AppContextMenu v-if="contextMenuOpen" class="dispute-context-menu">
          <AppContextMenuItem>Close&nbsp;Dispute</AppContextMenuItem>
        </AppContextMenu>
      </div>
    </div>
  </li>
  <div class="button-sm-actions">
    <AppLink
      size="sm"
      outlined
      :to="{
        name: 'AdminSingleDisputePage',
        params: {
          id: dispute.id,
        },
      }"
      >Open</AppLink
    >
    <AppButton class="chat-button" size="sm" @click="joinDisputeChat">Chat</AppButton>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import AppDottedButton from '@/components/common/AppDottedButton.vue'
import AppContextMenu from '@/components/common/AppContextMenu.vue'
import AppLink from '@/components/common/AppLink.vue'
import AppContextMenuItem from '@/components/common/AppContextMenuItem.vue'
// import { getMessageTimeFormatted } from '@/components/helpers/timeFormatter'
import { DisputeAdminUiInfo, DisputeState } from '@/types/disputes'

export default defineComponent({
  components: {
    AppButton,
    AppDottedButton,
    AppContextMenu,
    AppContextMenuItem,
    AppLink,
  },
  props: {
    dispute: {
      type: Object as PropType<DisputeAdminUiInfo>,
      required: true,
    },
  },
  emits: ['join-regular-chat', 'join-dispute-chat'],
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

    // const dateFormatted = computed(() => getMessageTimeFormatted(props.dispute.cre))

    // const joinChat = () => {
    //   emit('join-chat', props.dispute)
    // }

    const isDisputeOpen = computed(() => props.dispute.state === DisputeState.OPEN)
    const isDisputeClosed = computed(() => props.dispute.state === DisputeState.CLOSED)
    const disputeStateText = computed(() => {
      if (isDisputeOpen.value) return 'open'
      if (isDisputeClosed.value) return 'closed'
      return 'no state'
    })
    const disputeStateClasses = computed(() => {
      if (isDisputeOpen.value) return '--new'
      if (isDisputeClosed.value) return '--closed'
      return ''
    })

    const adminText = computed(() => {
      if (props.dispute.isAdminInChat && props.dispute.joinedDisputeChat) return 'me'
      if (props.dispute.isAdminInChat) return 'other admin'
      return 'no admin'
    })
    const adminClasses = computed(() => {
      if (!props.dispute.isAdminInChat) return '--not-selected'
      return ''
    })

    const joinDisputeChat = () => emit('join-dispute-chat', props.dispute)

    return {
      // dateFormatted,
      isDisputeClosed,
      adminText,
      adminClasses,
      disputeStateClasses,
      disputeStateText,
      contextMenuOpen,
      toggleContextMenu,
      triggerOpen,
      triggerClose,
      preventClose,
      joinDisputeChat,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/marketer/admin/disputes/DisputesListItem';
</style>
