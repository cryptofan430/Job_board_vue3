<template>
  <li class="messages-list-item" :class="userIdentityClass">
    <div v-if="!messagesListItem.ofCurrentUser" class="messages-list-avatar">
      <AppAvatar v-if="!isSystemMessage" :img-url="messageUser?.avatarSignedUrl" size="md" />
    </div>

    <div class="user-messages">
      <MessageListMessage
        v-for="message in messagesListItem.messages"
        :id="message.id"
        :key="message.id"
        :message="message"
        :other-chat-users="messagesListItem.otherUsers"
        :of-current-user="messagesListItem.ofCurrentUser"
        @reply-to-message="reply"
        @remove-message="remove"
      />
    </div>

    <div v-if="messagesListItem.ofCurrentUser && !isSystemMessage" class="messages-list-avatar">
      <AppAvatar v-if="!isSystemMessage" :img-url="messageUser?.avatarSignedUrl" size="md" />
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import AppAvatar from '@/components/common/AppAvatar.vue'
import MessageListMessage from '@/components/chat/content/MessageListMessage.vue'
import { MessageType, ChatMessagesListItem, SimpleChatMessage, SimpleChat } from '@/types/chat.model'

export type MessageListItemVariant =
  | 'v1'
  | 'v2'
  | 'v3'
  | 'v4'
  | 'v5'
  | 'v6'
  | 'v7'
  | 'v8'
  | 'v9'
  | 'v10'
  | 'v11'
  | 'v12'
  | 'v13'
  | 'v14'
  | 'v15'
  | 'v16'

export default defineComponent({
  components: {
    MessageListMessage,
    AppAvatar,
  },
  props: {
    variant: {
      type: String as PropType<MessageListItemVariant>,
      required: false,
    },
    messagesListItem: {
      type: Object as PropType<ChatMessagesListItem>,
      required: true,
    },
    ofCurrentUser: {
      type: Boolean,
      default: false,
    },
    activeChat: {
      type: Object as PropType<SimpleChat>,
      required: true,
    },
  },
  emits: ['reply-to-message', 'remove-message'],
  setup(props, { emit }) {
    const userIdentityClass = computed(() => {
      const otherUserClass = props.messagesListItem.ofCurrentUser ? 'messages-list-item-my' : 'messages-list-item-user'
      const variantClass = props.variant ? `chat-message-variant --chat-message-variant-${props.variant}` : ''
      return `${otherUserClass} ${variantClass}`
    })

    const messageUser = computed(() => {
      return props.activeChat?.users.find(({ id }) => id === props.messagesListItem.messages?.[0]?.userId)
    })

    const reply = (message: SimpleChatMessage) => {
      emit('reply-to-message', message)
    }

    const remove = (message: SimpleChatMessage) => {
      emit('remove-message', message)
    }

    const isSystemMessage = computed(() => {
      const message = props.messagesListItem.messages[0]
      const flag = message.type === MessageType.SYSTEM
      return flag
    })

    return { userIdentityClass, messageUser, isSystemMessage, reply, remove }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/chat/content/MessagesListItem';
</style>
