<template>
  <form class="send-message-panel" novalidate autocomplete="off" @submit.prevent="sendChatMessage">
    <input ref="fileInputRef" class="visually-hidden" type="file" multiple @input="handleFilesInput" />

    <div class="message-input-wrapper">
      <div class="mobile-version-input">
        <AppInputDecoration>
          <template #default="{ classList }">
            <AppInput
              id="send-message-input"
              ref="mobileInputRef"
              v-model="inputMessageText"
              class="message-input"
              :class="classList"
              short
              size="lg"
              placeholder="Type your message..."
              :disabled="!!getActiveChat?.archivedByUserId"
              @update:modelValue="clearFileErrorText"
              @focus="onFocus"
              @click="onFocus"
              @blur="onBlur"
            />
          </template>

          <template #rightIcon>
            <div :is-loading="!isAllFilesUploaded" @click="openFileDialog(), clearFileErrorText()">
              <AppIcon class="attach-file-icon" name="attach" size="sm" :color="variables.cGrey300" />
            </div>
          </template>
        </AppInputDecoration>
      </div>

      <div class="desktop-version-input">
        <AppInput
          id="desktop-send-message-input"
          v-model="inputMessageText"
          class="message-input"
          short
          size="lg"
          placeholder="Type your message..."
          :disabled="!!getActiveChat?.archivedByUserId"
          @update:modelValue="clearFileErrorText"
          @focus="onFocus"
          @click="onFocus"
          @blur="onBlur"
        />
      </div>

      <AppInputError v-if="filesErrorText">{{ filesErrorText }}</AppInputError>

      <div class="post-content">
        <div v-if="getMessageResponseTo?.message" class="chat-reply-content">
          <div class="chat-reply-wrapper">
            <ChatReply>{{ getMessageResponseTo.message }}</ChatReply>
          </div>
          <button class="chat-reply-close-btn" type="button" @click="chatReplyBoxClose" />
        </div>
        <div
          v-if="getMessageResponseTo?.files && getMessageResponseTo.files.length != 0 && !getMessageResponseTo.message"
          class="chat-reply-content"
        >
          <div class="chat-reply-wrapper">
            <ChatReply>
              <ChatAttachedFilesItem v-for="file of getMessageResponseTo.files" :key="file.id" :file="file" />
            </ChatReply>
          </div>
          <button class="chat-reply-close-btn" type="button" @click="chatReplyBoxClose" />
        </div>
        <SendMessageAttachments :file-entries="getFileUploadEntries" @remove-file-entry="removeFileEntry" />
      </div>
    </div>
    <div class="desktop-attach-file">
      <div class="attach-file">
        <AppButton
          size="xsm"
          icon="attach"
          class="attachment-button"
          type="button"
          :disabled="!isAllFilesUploaded || !!getActiveChat?.archivedByUserId"
          :is-loading="!isAllFilesUploaded"
          @click="openFileDialog(), clearFileErrorText()"
        />
      </div>
    </div>
    <div class="desktop-send-button">
      <AppButton :disabled="!isAllFilesUploaded || !!getActiveChat?.archivedByUserId" size="md" type="submit"
        >Send</AppButton
      >
    </div>

    <div class="mobile-send-button">
      <AppButton
        :disabled="!isAllFilesUploaded || !!getActiveChat?.archivedByUserId"
        size="md"
        type="submit"
        icon="chat-send"
        @click="focusMobileInput"
      />
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import ChatReply from '@/components/chat/content/ChatReply.vue'
import SendMessageAttachments from '@/components/chat/panel/SendMessageAttachments.vue'
import useChatSendMessage from '@/components/chat/panel/chat-send-message-panel'
import AppInputError from '@/components/common/AppInputError.vue'
import AppInputDecoration from '@/components/common/AppInputDecoration.vue'
import variables from '@/assets/variables'
import useChatContent from '../content/chat-content'
import ChatAttachedFilesItem from '@/components/chat/content/ChatAttachedFilesItem.vue'

export default defineComponent({
  components: {
    AppInput,
    AppInputDecoration,
    AppInputError,
    AppButton,
    AppIcon,
    ChatReply,
    SendMessageAttachments,
    ChatAttachedFilesItem,
  },
  setup() {
    const {
      getFileUploadEntries,
      getMessageResponseTo,
      inputMessageText,
      isAllFilesUploaded,
      filesErrorText,
      addMessage,
      handleFilesInput,
      clearFileErrorText,
      removeFileEntry,
      chatReplyClose,
    } = useChatSendMessage()
    const { scrollContainer, getActiveChat, scrollToChatBottom } = useChatContent()
    const fileInputRef = ref<HTMLInputElement | null>(null)
    let previousWindowHeight = window.innerHeight

    const mobileInputRef = ref<unknown | null>(null)

    const watchResize = () => {
      if (window.innerHeight < previousWindowHeight) {
        scrollToChatBottom()
      }
      previousWindowHeight = window.innerHeight
    }

    const onFocus = () => {
      previousWindowHeight = window.innerHeight
      window.removeEventListener('resize', watchResize)
      const container = scrollContainer.value

      const isScrolledToBottom =
        Math.abs((container?.scrollHeight || 0) - ((container?.scrollTop || 0) + (container?.offsetHeight || 0))) < 8
      if (isScrolledToBottom) {
        window.addEventListener('resize', watchResize)
      }
    }

    const onBlur = () => {
      previousWindowHeight = window.innerHeight
      window.removeEventListener('resize', watchResize)
    }

    const openFileDialog = () => {
      fileInputRef.value?.click()
    }

    const sendChatMessage = () => {
      addMessage()
    }

    const focusMobileInput = () => {
      if (window.innerWidth <= 767) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(mobileInputRef.value as any)?.$el?.focus?.()
      }
    }

    const chatReplyBoxClose = () => {
      chatReplyClose()
      inputMessageText.value = ''
    }

    return {
      getFileUploadEntries,
      isAllFilesUploaded,
      filesErrorText,
      inputMessageText,
      getMessageResponseTo,
      fileInputRef,
      getActiveChat,
      mobileInputRef,
      variables,
      clearFileErrorText,
      handleFilesInput,
      openFileDialog,
      addMessage,
      focusMobileInput,
      sendChatMessage,
      removeFileEntry,
      onFocus,
      onBlur,
      chatReplyBoxClose,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/chat/panel/SendMessagePanel';
</style>
