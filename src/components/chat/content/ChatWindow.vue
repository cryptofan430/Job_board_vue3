<template>
  <div v-if="!isMobilePopup" class="chat-window" :class="{ activechatwindow: isActive }">
    <template v-if="getActiveChat">
      <ChatHeader />
      <MessagesList :key="getActiveChat.id">
        <ChatMessageTyping />
      </MessagesList>
      <div class="chat-bottom-content-root">
        <div class="chat-bottom-content-wrapper">
          <div class="chat-bottom-content">
            <SendMessagePanel />
          </div>
        </div>
      </div>
    </template>

    <div v-else-if="!getActiveChat && !isOldestChatLoaded && !isSidebarChatsError" class="chat-content-state">
      <AppSkeleton></AppSkeleton>
    </div>
  </div>
  <router-view v-if="getActiveChat?.id" />
</template>

<script lang="ts">
import { defineComponent, watch, computed } from 'vue'
import ChatHeader from '@/components/chat/content/ChatHeader.vue'
import MessagesList from '@/components/chat/content/MessagesList.vue'
import SendMessagePanel from '@/components/chat/panel/SendMessagePanel.vue'
import ChatMessageTyping from '@/components/chat/content/ChatMessageTyping.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import useChatContent from './chat-content'
import { setTitle } from '@/components/helpers/dom'
import useUserStore from '@/store/user'
import { getIsMobilePopup } from '@/components/helpers/dom'

export default defineComponent({
  name: 'ChatWindow',
  components: {
    AppSkeleton,
    ChatHeader,
    MessagesList,
    SendMessagePanel,
    ChatMessageTyping,
  },
  props: {
    active: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const { getActiveChat, isSidebarChatsError, isOldestChatLoaded } = useChatContent()
    const { getMyId, getMyProfile } = useUserStore()

    if (!('ResizeObserver' in window)) {
      import('resize-observer-polyfill').then((ResizeObserver) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window as any).ResizeObserver = ResizeObserver
      })
    }

    watch(getActiveChat, (chat) => {
      const differentUser = chat?.users.find(({ id }) => id !== getMyId.value) || getMyProfile?.value?.influencer
      let mainTitle = 'Freelance Influencer | Chat'
      if (chat) mainTitle += ' with ' + differentUser?.firstName || '' + ' ' + differentUser?.lastName || ''
      setTitle(mainTitle)
    })
    const isMobilePopup = getIsMobilePopup()

    const isActive = computed(() => props.active)

    return {
      isMobilePopup,
      getActiveChat,
      isOldestChatLoaded,
      isSidebarChatsError,
      isActive,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/chat/content/ChatWindow';
</style>
