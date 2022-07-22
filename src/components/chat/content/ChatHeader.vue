<template>
  <div class="chat-header">
    <div class="chat-back-icon">
      <AppBackButton button-text="" :back-route="{ name: 'EmptyChat' }" />
    </div>
    <AppAvatar size="lg" :img-url="getDialogUser?.avatarSignedUrl" />

    <div class="chat-user-identity">
      <p class="chat-user-name" :title="getDialogUser?.firstName + ' ' + getDialogUser?.lastName">
        {{ getDialogUser?.firstName || '' }} {{ getDialogUser?.lastName || '' }}
      </p>
      <router-link :to="redirectRoute" class="chat-header-title-description">
        <p class="user-contact">{{ description }}</p>
      </router-link>
    </div>
    <div class="chat-popup">
      <div v-if="enableArchiveAction" class="chat-popup-icon">
        <OpenContextMenuButton @click="openContextMenu" />
        <div v-if="isContextMenuOpen" class="context-menu-wrapper">
          <ContextMenu @close="closeContextMenu">
            <ContextMenuItem v-if="enableArchive">
              <router-link
                class="archivate-chat-link"
                :to="{ name: 'PopupArchivateChat' }"
                @click.capture="closeContextMenu"
                >Archive</router-link
              >
            </ContextMenuItem>
            <ContextMenuItem v-if="enableUnarchive" @click="chatUnarchive">Unarchive</ContextMenuItem>
          </ContextMenu>
        </div>
      </div>
    </div>
  </div>
  <PopupArchivationMethod
    v-if="isArchivationMethod"
    :user-avatar="userAvatar"
    :user-first-name="userFirstName"
    :user-last-name="userLastName"
    @send-archivation="sendArchivation"
    @close="togglePopupArchivationMethodVisibility"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import useChatContent from './chat-content'
import AppAvatar from '@/components/common/AppAvatar.vue'
import OpenContextMenuButton from '@/components/chat/content/OpenContextMenuButton.vue'
import ContextMenu from '@/components/common/AppContextMenu.vue'
import ContextMenuItem from '@/components/common/AppContextMenuItem.vue'
import { useStringPathParamReactive } from '@/components/helpers/route'
import useChatController from '@/middleware/controllers/useChatController'
import PopupArchivationMethod from '@/components/settings/popups/PopupArchivationMethod.vue'
import AppBackButton from '@/components/common/AppBackButton.vue'
import { ClientUserState } from '@/types/user.model'

export default defineComponent({
  components: {
    AppAvatar,
    AppBackButton,
    ContextMenu,
    ContextMenuItem,
    OpenContextMenuButton,
    PopupArchivationMethod,
  },
  setup() {
    const { getActiveChat, currentUserId, getMyProfile, getChatArchiveState } = useChatContent()
    const chatId = useStringPathParamReactive('chatId')
    const isContextMenuOpen = ref(false)
    const { archiveChat, unarchiveChat } = useChatController()
    const chatArchiveState = getChatArchiveState()
    const isArchivationMethod = ref(false)
    const userAvatar = ref()
    const userFirstName = ref()
    const userLastName = ref()

    const redirectRoute = computed(() => {
      if (getActiveChat.value?.ticketChatTypeDataPublicInfo) return { name: 'SettingsHelp' }
      if (getActiveChat.value?.disputeChatTypeDataPublicInfo)
        return {
          name:
            getActiveChat.value.disputeChatTypeDataPublicInfo?.clientUserState === ClientUserState.INFLUENCER
              ? 'SettingsInfluencerDisputes'
              : 'SettingsMarketerDisputes',
        }
      if (getActiveChat.value?.taskChatTypeDataPublicInfo)
        return {
          name:
            getActiveChat.value.taskChatTypeDataPublicInfo.clientUserState === ClientUserState.INFLUENCER
              ? 'Proposal'
              : 'MarketerTaskDetails',
          params: {
            taskId: getActiveChat.value?.taskChatTypeDataPublicInfo.taskId,
          },
        }
      if (getActiveChat.value?.contractChatTypeDataPublicInfo)
        return {
          name:
            getActiveChat.value.contractChatTypeDataPublicInfo.clientUserState === ClientUserState.INFLUENCER
              ? 'ContractManagement'
              : 'MarketerTaskSingleContract',
          params: {
            taskId: getActiveChat.value.contractChatTypeDataPublicInfo.taskId,
            contractId: getActiveChat.value.contractChatTypeDataPublicInfo.contractId,
          },
        }
      return '/not-found'
    })

    const description = computed(() => {
      return (
        getActiveChat.value?.ticketChatTypeDataPublicInfo?.description ||
        getActiveChat.value?.disputeChatTypeDataPublicInfo?.description ||
        getActiveChat.value?.taskChatTypeDataPublicInfo?.description ||
        getActiveChat.value?.contractChatTypeDataPublicInfo?.description
      )
    })

    const openContextMenu = () => {
      isContextMenuOpen.value = true
    }

    const closeContextMenu = () => {
      isContextMenuOpen.value = false
    }

    const togglePopupArchivationMethodVisibility = () => {
      isArchivationMethod.value = !isArchivationMethod.value
    }

    const sendArchivation = () => {
      archiveChat(chatId.value)
      isArchivationMethod.value = false
    }

    const chatUnarchive = () => {
      unarchiveChat(chatId.value)
      isContextMenuOpen.value = false
    }

    const enableArchive = computed(() => {
      const archiveUserId = getActiveChat?.value?.archivedByUserId

      return !archiveUserId
    })

    const enableUnarchive = computed(() => {
      const archiveUserId = getActiveChat?.value?.archivedByUserId

      return archiveUserId === currentUserId.value
    })

    const enableArchiveAction = computed(() => {
      return enableArchive.value || enableUnarchive.value
    })

    const getDialogUser = computed(() => {
      const users = getActiveChat?.value?.users
      if (!users?.length) return null
      if (users?.length === 1) return users[0]
      const notCurrentUsers = users.filter((user) => currentUserId?.value !== user.id)

      return notCurrentUsers[0] || null
    })

    return {
      getActiveChat,
      getDialogUser,
      isContextMenuOpen,
      chatArchiveState,
      currentUserId,
      enableArchiveAction,
      enableArchive,
      enableUnarchive,
      description,
      redirectRoute,
      isArchivationMethod,
      getMyProfile,
      userFirstName,
      userLastName,
      userAvatar,
      sendArchivation,
      togglePopupArchivationMethodVisibility,
      openContextMenu,
      closeContextMenu,
      chatUnarchive,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/chat/content/ChatHeader';
</style>
