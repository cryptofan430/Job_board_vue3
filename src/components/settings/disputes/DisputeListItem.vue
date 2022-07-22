<template>
  <li class="disputes-item">
    <div class="disputes-item-content">
      <div class="disputes-item-info">
        <h3 class="disputes-item-header">{{ dispute.projectName }}</h3>
        <p class="dispute-milestone-name">{{ dispute.milestoneName }}</p>
      </div>
      <div class="actions">
        <AppLink class="contract-button" :to="contractLink" size="sm" outlined>Contact</AppLink>
        <AppLink
          :to="{
            name: 'SelectedChat',
            params: {
              chatId: dispute.chatId,
            },
          }"
          size="sm"
          >Chat</AppLink
        >
      </div>
    </div>

    <!-- <div class="post-content" @focusin="preventClose" @focusout="triggerClose">
      <AppDottedButton class="dotted-button-content" @click="toggleContextMenu" />
      <AppContextMenu v-if="contextMenuOpen" class="dispute-context-menu">
        <AppContextMenuItem :disabled="!!dispute.milestoneValueAfterDispute">Close&nbsp;Dispute</AppContextMenuItem>
      </AppContextMenu>
    </div>-->
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed } from 'vue'
import AppLink from '@/components/common/AppLink.vue'
import { DisputePublicInfo } from '@/types/disputes'
// import AppDottedButton from '@/components/common/AppDottedButton.vue'
// import AppContextMenu from '@/components/common/AppContextMenu.vue'
// import AppContextMenuItem from '@/components/common/AppContextMenuItem.vue'

export default defineComponent({
  name: 'DisputeListItem',
  components: {
    // AppDottedButton,
    // AppContextMenu,
    // AppContextMenuItem,
    AppLink,
  },
  props: {
    dispute: {
      type: Object as PropType<DisputePublicInfo>,
      required: true,
    },
    isMarketer: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const contextMenuOpen = ref(false)
    let timer: number | null = null

    const contractLink = computed(() => {
      if (props.isMarketer) return `/m/tasks/:taskId/contracts/${props.dispute.contractId}`
      return `/i/tasks/${props.dispute.taskId}/contracts/${props.dispute.contractId}/management`
    })

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

    return {
      contractLink,
      contextMenuOpen,
      toggleContextMenu,
      triggerOpen,
      triggerClose,
      preventClose,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/disputes/DisputeListItem';
</style>
