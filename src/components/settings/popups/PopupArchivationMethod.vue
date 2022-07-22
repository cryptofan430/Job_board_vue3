<template>
  <div class="popup">
    <div class="popup-content">
      <AppBackButton button-text="Back" :back-route="{ name: $route.meta.backRoute }" class="popup-back-button" />
      <AppCloseButton class="popup-close-button" @click="onClose" />

      <h3 class="popup-title">Are you sure you want to achivate this chat?</h3>
      <p class="additional-info">
        Please, note that this user will be blocked after chat archivation.<br />
        You can undo this action anytime.
      </p>
      <div class="user-area">
        <AppAvatar size="md" :img-url="getDialogUser?.avatarSignedUrl" />
        <div class="user-desc">
          <p class="user-name">{{ getDialogUser?.firstName }} {{ getDialogUser?.lastName }}</p>
          <router-link :to="redirectRoute">
            <p class="chat-title">{{ description }}</p>
          </router-link>
        </div>
      </div>
      <div class="button-area">
        <AppButton class="archivate-button" @click="doArchivation">Archivate</AppButton>
        <AppButton class="cancel-button" outlined @click="onClose">Cancel</AppButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue'
import AppCloseButton from '@/components/common/AppCloseButton.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppAvatar from '@/components/common/AppAvatar.vue'
import { useRoute, useRouter } from 'vue-router'
import useChatContent from '@/components/chat/content/chat-content'
import useUserStore from '@/store/user'
import useChatController from '@/middleware/controllers/useChatController'
import useToastsStore from '@/store/toasts'
import AppBackButton from '@/components/common/AppBackButton.vue'
import { setTitle } from '@/components/helpers/dom'
import { ClientUserState } from '@/types/user.model'

export default defineComponent({
  name: 'PopupGetPaid',
  components: {
    AppCloseButton,
    AppButton,
    AppAvatar,
    AppBackButton,
  },
  setup() {
    const { getActiveChat } = useChatContent()
    const { getMyId } = useUserStore()
    const { archiveChat } = useChatController()
    const { addToast } = useToastsStore()

    const getDialogUser = computed(() => {
      const users = getActiveChat?.value?.users
      if (!users?.length) return null
      if (users?.length === 1) return users[0]
      const notCurrentUsers = users.filter((user) => getMyId.value !== user.id)

      return notCurrentUsers[0] || null
    })

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

    const router = useRouter()
    const route = useRoute()

    const onClose = () => router.push({ name: route.meta.backRoute as string })

    watch(
      getDialogUser,
      (user) => {
        if (user) {
          setTitle('Freelance Influencer | Archivate Chat With ' + user.firstName + ' ' + user.lastName)
        }
      },
      { immediate: true }
    )

    const doArchivation = () => {
      if (!getActiveChat.value?.id) return
      archiveChat(getActiveChat.value.id)
        .then(() => {
          addToast('Chat was achivated', 'success')
          onClose()
        })
        .catch(() => {
          addToast('An error occurred during chat achivation', 'danger')
        })
    }

    return { getDialogUser, redirectRoute, description, doArchivation, onClose }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/popups/ArchivationMethod';
</style>
