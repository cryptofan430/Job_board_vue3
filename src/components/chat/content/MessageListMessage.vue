<template>
  <div v-if="isSystemMessage" :id="id" ref="messageElementRef" class="system-message-item-root">
    <SystemMessage v-if="isSystemMessage">{{ message.message }}</SystemMessage>
    <ChatAttachedFiles v-if="!message.deleted && message.files?.length" :files="message.files" />
  </div>

  <div
    v-if="!isSystemMessage"
    :id="id"
    ref="messageElementRef"
    class="message-item-root"
    :class="messageBackgroundClass"
  >
    <ChatReply
      v-if="message.responseToMessage?.message || message.responseToMessage?.fileNames?.length"
      @click="scrollToMessage(message.responseToMessage?.id)"
    >
      <div v-if="!message.deleted && message.responseToMessage?.fileNames?.length" class="reply-attach-files">
        <div v-for="fileName of message.responseToMessage?.fileNames" :key="fileName" class="content-wrapper">
          <a class="attached-file-link">
            <AppIcon name="attach" size="md" color="currentColor" />
            <span class="attached-file-name">{{ fileName }}</span>
          </a>
        </div>
      </div>
      {{ message.responseToMessage?.deleted ? 'Message deleted' : message.responseToMessage?.message }}
    </ChatReply>

    <SystemMessage v-if="message.deleted">Message deleted.</SystemMessage>
    <ChatAttachedFiles v-if="!message.deleted && message.files?.length" :files="message.files" />
    <p v-if="!message.deleted">{{ message.message }}</p>

    <div class="message-time">
      <OpenContextMenuButton v-if="!isSystemMessage && !message.deleted" @click="openContextMenu" />
      <div v-if="isContextMenuOpen" class="context-menu-wrapper">
        <ContextMenu :primary="!ofCurrentUser" @close="closeContextMenu">
          <ContextMenuItem @click="reply" @keydown.enter="reply">Reply</ContextMenuItem>

          <!-- Disabled delete message feature. Can be enabled again in future -->
          <!-- <ContextMenuItem v-if="ofCurrentUser" @click="remove" @keydown.enter="remove">Delete</ContextMenuItem> -->
        </ContextMenu>
      </div>
      <span v-if="!isSystemMessage" class="message-time-text">{{ messageTime }}</span>
    </div>

    <div class="scooped-corner">
      <svg viewBox="0 0 11 20" width="11" height="20">
        <use href="#message-tail" />
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref } from 'vue'
import { MessageType, SimpleChatMessage } from '@/types/chat.model'
import { getMessageTimeFormatted } from '@/components/helpers/timeFormatter'
import ChatReply from '@/components/chat/content/ChatReply.vue'
import ContextMenu from '@/components/common/AppContextMenu.vue'
import ContextMenuItem from '@/components/common/AppContextMenuItem.vue'
import ChatAttachedFiles from '@/components/chat/content/ChatAttachedFilesList.vue'
import SystemMessage from '@/components/chat/content/SystemMessage.vue'
import OpenContextMenuButton from '@/components/chat/content/OpenContextMenuButton.vue'
import useMessageListMessage from '@/components/chat/content/message-list-message'
import Autolinker from 'autolinker'
import AppIcon from '@/components/common/AppIcon.vue'

export default defineComponent({
  components: {
    ChatReply,
    ContextMenu,
    ContextMenuItem,
    ChatAttachedFiles,
    SystemMessage,
    OpenContextMenuButton,
    AppIcon,
  },
  props: {
    otherChatUsers: {
      type: Array,
      required: false,
    },
    ofCurrentUser: {
      type: Boolean,
      default: false,
    },
    message: {
      type: Object as PropType<SimpleChatMessage>,
      required: true,
    },
    id: {
      type: String,
      required: false,
    },
  },
  emits: ['reply-to-message', 'remove-message'],
  setup(props, { emit }) {
    const { messageElementRef, observeMessageSeen, scrollToMessage } = useMessageListMessage()

    const isContextMenuOpen = ref(false)
    const contextMenuTop = ref(0)
    const contextMenuLeft = ref(0)

    const isSystemMessage = computed(() => {
      return props.message.type === MessageType.SYSTEM
    })

    const messageTime = computed(() => getMessageTimeFormatted(props.message.date))

    const openContextMenu = (e: PointerEvent) => {
      contextMenuTop.value = e.pageY - 6
      contextMenuLeft.value = e.pageX - 18
      isContextMenuOpen.value = true
    }

    const closeContextMenu = () => {
      contextMenuTop.value = 0
      contextMenuLeft.value = 0
      isContextMenuOpen.value = false
    }

    const reply = () => {
      closeContextMenu()
      emit('reply-to-message', props.message)
    }

    const remove = () => {
      closeContextMenu()
      emit('remove-message', props.message)
    }

    const messageBackgroundClass = computed(() => {
      if (props.ofCurrentUser) {
        return `current-user-bg`
      }
      const index = props.otherChatUsers?.indexOf(props.message.userId)
      return `other-user-bg-${index}`
    })

    onMounted(() => {
      if (!props.ofCurrentUser) observeMessageSeen(props.message.id)
    })

    const handledMessage = computed(() => {
      // the library sanitizes html, so there is no XSS vulnerability
      return Autolinker.link(props.message.message || '', {
        email: true,
        phone: true,
        sanitizeHtml: true,
        urls: true,
        className: 'chat-auto-link',
      })
    })

    return {
      messageElementRef,
      isSystemMessage,
      isContextMenuOpen,
      contextMenuTop,
      contextMenuLeft,
      messageTime,
      handledMessage,
      messageBackgroundClass,
      scrollToMessage,
      openContextMenu,
      closeContextMenu,
      reply,
      remove,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/chat/content/MessageListMessage';
</style>
