<template>
  <ScoopedCornerDefinition />

  <div ref="scrollContainer" class="chat-messages-list-wrapper" :style="messsagesListStyle" @scroll="onScrolledToTop">
    <div v-if="getOlderMessagesError" class="chat-messages-error">
      <AppButton outlined @click="fetchOlderMessages"> Load earlier messages... </AppButton>
    </div>
    <ul v-if="getActiveChat" class="chat-messages-list">
      <MessagesListItem
        v-for="messagesListItem in messagesList"
        :key="messagesListItem.id"
        :messages-list-item="messagesListItem"
        :active-chat="getActiveChat"
        @reply-to-message="setResponseMessage"
        @remove-message="removeMessage"
      />
    </ul>
  </div>

  <slot></slot>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue'
import useChatContent from '@/components/chat/content/chat-content'
import MessagesListItem from '@/components/chat/content/MessagesListItem.vue'
import ScoopedCornerDefinition from '@/components/chat/content/ScoopedCornerDefinition.vue'
import AppButton from '@/components/common/AppButton.vue'
import { getIsMobilePhone } from '@/components/helpers/dom'

export default defineComponent({
  name: 'MessagesList',
  components: {
    AppButton,
    MessagesListItem,
    ScoopedCornerDefinition,
  },
  setup() {
    const {
      getActiveChatMessages,
      getOlderMessagesError,
      getActiveChat,
      scrollContainer,
      fetchOlderMessages,
      getChatMessages,
      setResponseMessage,
      removeMessage,
      markLatestMassageRead,
      onScrolledToTop,
      scrollToChatBottom,
    } = useChatContent()

    if (getActiveChatMessages.value?.length < 16)
      fetchOlderMessages()?.then(() => [scrollToChatBottom(), setTimeout(scrollToChatBottom)])
    const isMobile = getIsMobilePhone()
    const messagesList = getChatMessages()
    const innerHeight = ref(window.innerHeight)

    const onResize = () => {
      innerHeight.value = window.innerHeight
    }

    onMounted(() => {
      window.addEventListener('resize', onResize)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', onResize)
    })

    const messsagesListStyle = computed(() => {
      if (isMobile.value) return `max-height: calc(${innerHeight.value}px - 8.1rem)`

      return `max-height: calc(${innerHeight.value}px - 19.25rem);`
    })

    onMounted(() => {
      markLatestMassageRead()
      scrollToChatBottom()
    })

    return {
      getOlderMessagesError,
      messagesList,
      getActiveChat,
      scrollContainer,
      messsagesListStyle,
      fetchOlderMessages,
      onScrolledToTop,
      setResponseMessage,
      removeMessage,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/chat/content/MessagesList';
</style>
