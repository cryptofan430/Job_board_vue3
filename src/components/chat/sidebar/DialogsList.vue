<template>
  <AppErrorBox v-if="isError && !isMobilePopup" @clicked="initSidebarChats"> dialogs </AppErrorBox>

  <AppSkeleton v-else-if="isLoading && !isMobilePopup" />

  <ul v-else-if="!isMobilePopup" class="dialogs-list" @scroll.passive="onScrolledToBottom">
    <li v-for="chat in getSidebarChats" :key="chat.id" class="dialog-link-wrapper">
      <router-link :to="'/chat/' + chat.id">
        <DialogListItem
          :chat="chat"
          :is-active="getActiveChat?.id === chat.id"
          :new-message-count="chat.unreadMessages"
        />
      </router-link>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DialogListItem from '@/components/chat/sidebar/DialogListItem.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import useChatSidebar from '@/components/chat/sidebar/chat-sidebar'
import { getIsMobilePopup } from '@/components/helpers/dom'

export default defineComponent({
  name: 'TheUsersList',
  components: {
    DialogListItem,
    AppErrorBox,
    AppSkeleton,
  },
  setup() {
    const {
      isError,
      isLoading,
      getActiveChat,
      getSidebarChats,
      isOldestChatLoaded,
      watchActiveChatUrl,
      findAndSetActiveChat,
      initSidebarChats,
      onScrolledToBottom,
    } = useChatSidebar()
    const isMobilePopup = getIsMobilePopup()

    watchActiveChatUrl()
    findAndSetActiveChat()

    return {
      isError,
      isLoading,
      getActiveChat,
      getSidebarChats,
      isMobilePopup,
      isOldestChatLoaded,
      initSidebarChats,
      onScrolledToBottom,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/chat/sidebar/DialogsList';
</style>
