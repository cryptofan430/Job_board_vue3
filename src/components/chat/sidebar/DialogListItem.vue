<template>
  <div class="dialogs-list-item" :class="classList">
    <AppAvatar :img-url="displayUser?.avatarSignedUrl" size="md" status="online" />

    <div v-if="displayUser" class="user-identity">
      <p class="user-name">{{ displayUser.firstName }} {{ displayUser.lastName }}</p>
      <router-link :to="redirectRoute" class="chat-description-link">
        <p v-if="!typingMessage" class="user-contact">{{ description }}</p>
      </router-link>
      <p class="user-typing-message">{{ typingMessage }}</p>
    </div>

    <div>
      <p class="message-date">
        {{ dialogDate }}
      </p>
      <p v-if="newMessageCount" class="new-message-count">
        {{ newMessageCount }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { SimpleChat } from '@/types/chat.model'
import useDialogListItem from '@/components/chat/sidebar/dialog-list-item'
import AppAvatar from '@/components/common/AppAvatar.vue'
import { ClientUserState } from '@/types/user.model'

export default defineComponent({
  components: {
    AppAvatar,
  },
  props: {
    chat: {
      type: Object as PropType<SimpleChat>,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    typingMessage: {
      type: String,
      required: false,
    },
    newMessageCount: {
      type: Number,
      require: false,
      default: 0,
    },
  },
  setup(props) {
    const { getChatProps } = useDialogListItem()
    const { displayUser, dialogDate } = getChatProps(props.chat)

    const redirectRoute = computed(() => {
      if (props.chat?.ticketChatTypeDataPublicInfo) return { name: 'SettingsHelp' }
      if (props.chat?.disputeChatTypeDataPublicInfo)
        return {
          name:
            props.chat.disputeChatTypeDataPublicInfo?.clientUserState === ClientUserState.INFLUENCER
              ? 'SettingsInfluencerDisputes'
              : 'SettingsMarketerDisputes',
        }
      if (props.chat?.taskChatTypeDataPublicInfo)
        return {
          name:
            props.chat.taskChatTypeDataPublicInfo?.clientUserState === ClientUserState.INFLUENCER
              ? 'Proposal'
              : 'MarketerTaskDetails',
          params: {
            taskId: props.chat.taskChatTypeDataPublicInfo.taskId,
          },
        }
      if (props.chat?.contractChatTypeDataPublicInfo)
        return {
          name:
            props.chat.contractChatTypeDataPublicInfo.clientUserState === ClientUserState.INFLUENCER
              ? 'ContractManagement'
              : 'MarketerTaskSingleContract',
          params: {
            taskId: props.chat?.contractChatTypeDataPublicInfo.taskId,
            contractId: props.chat.contractChatTypeDataPublicInfo.contractId,
          },
        }
      return '/not-found'
    })

    const description = computed(() => {
      return (
        props.chat.ticketChatTypeDataPublicInfo?.description ||
        props.chat.disputeChatTypeDataPublicInfo?.description ||
        props.chat.taskChatTypeDataPublicInfo?.description ||
        props.chat.contractChatTypeDataPublicInfo?.description
      )
    })

    const classList = computed(() => {
      const activeClass = props.isActive ? 'users-list-item-active' : ''
      const newMessagesClass = props.newMessageCount ? 'users-list-item-new-messages' : ''

      return `${activeClass} ${newMessagesClass}`
    })

    return { classList, displayUser, dialogDate, description, redirectRoute }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/chat/sidebar/DialogsListItem';
</style>
