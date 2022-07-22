<template>
  <div class="popup">
    <div class="popup-content">
      <AppSkeleton v-if="isLoading" />
      <AppErrorBox v-else-if="isError" @clicked="loadSocialAccounts">account</AppErrorBox>
      <div v-else-if="!getAccountToDelete" class="popup-main-content">
        <AppBackButton button-text="Back" :back-route="{ name: $route.meta.backRoute }" class="popup-back-button" />
        <AppCloseButton class="popup-close-button" @click="onClose" />
        <AppEmptyBox>No account by the given parameters</AppEmptyBox>
      </div>
      <div v-else-if="getAccountToDelete" class="popup-main-content">
        <AppBackButton button-text="Back" :back-route="{ name: $route.meta.backRoute }" class="popup-back-button" />
        <AppCloseButton class="popup-close-button" @click="onClose" />

        <h3 class="popup-title">Are you sure you want to delete this account?</h3>

        <AccountCard
          class="popup-account-card-full"
          :icon="getAccountToDelete.platform.toLowerCase()"
          :account="getAccountToDelete.account.username"
          :tag-list="extractArrayOfTagNames(getAccountToDelete.account.tags)"
          :link="`/insights/${socialPlatform}/${getAccountToDelete?.account.id}`"
        />

        <div class="popup-actions">
          <AppButton class="popup-action-button-half" @click="onClose">Keep it</AppButton>

          <AppButton
            class="popup-action-button-half"
            outlined
            :disabled="isAccountDeleteInProgress"
            :is-loading="isAccountDeleteInProgress"
            @click="deleteSocialAccount"
            >Delete it</AppButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import AppCloseButton from '@/components/common/AppCloseButton.vue'
import AppButton from '@/components/common/AppButton.vue'
import AccountCard from '@/components/cards/AccountCard.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppBackButton from '@/components/common/AppBackButton.vue'
import AppEmptyBox from '@/components/common/AppEmptyBox.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import useSettingsSocialMedia from '../../social-media/social-media'
import useSocialMediaAccounts from '@/store/settings-social-media'
import { extractArrayOfTagNames } from '@/components/helpers/social-accounts'
import { useStringPathParamReactive } from '@/components/helpers/route'
import { SocialMediaPlatform } from '@/types/platform.model'
import { useRoute, useRouter } from 'vue-router'
import { setTitle } from '@/components/helpers/dom'

export default defineComponent({
  name: 'PopupAddSocialAccount',
  components: {
    AppCloseButton,
    AppButton,
    AppBackButton,
    AccountCard,
    AppErrorBox,
    AppEmptyBox,
    AppSkeleton,
  },
  setup() {
    const { getAccountToDelete, setAccountToDelete, deleteAccount, loadSocialAccounts, isAccountDeleteInProgress } =
      useSettingsSocialMedia()

    watch(
      getAccountToDelete,
      (accountToDelete) => {
        if (accountToDelete) {
          setTitle('Freelance Influence | Remove Account ' + accountToDelete.account.username)
        }
      },
      { immediate: true }
    )

    const socialPlatform = useStringPathParamReactive('socialPlatform')
    const accountId = useStringPathParamReactive('accountId')
    const router = useRouter()
    const route = useRoute()

    const onClose = () => router.push({ name: route.meta.backRoute as string })

    const { instagramAccounts, twitchAccounts, youtubeAccounts, tikTokAccounts, isLoading, isLoaded, isError } =
      useSocialMediaAccounts()

    watch(
      () => [isLoaded.value, twitchAccounts.value, instagramAccounts.value, youtubeAccounts.value],
      () => {
        if (isLoaded.value && socialPlatform.value === 'twitch') {
          const accountToDelete = twitchAccounts.value.find(({ id }) => id === accountId.value) || null
          console.log(twitchAccounts.value, accountToDelete, accountId.value)
          return setAccountToDelete(accountToDelete, SocialMediaPlatform.TWITCH)
        }
        if (isLoaded.value && socialPlatform.value === 'instagram') {
          const accountToDelete = instagramAccounts.value.find(({ id }) => id === accountId.value) || null
          return setAccountToDelete(accountToDelete, SocialMediaPlatform.INSTAGRAM)
        }
        if (isLoaded.value && socialPlatform.value === 'youtube') {
          const accountToDelete = youtubeAccounts.value.find(({ id }) => id === accountId.value) || null
          return setAccountToDelete(accountToDelete, SocialMediaPlatform.YOUTUBE)
        }
        if (isLoaded.value && socialPlatform.value === 'tiktok') {
          const accountToDelete = tikTokAccounts.value.find(({ id }) => id === accountId.value) || null
          return setAccountToDelete(accountToDelete, SocialMediaPlatform.TIKTOK)
        }
      },
      { immediate: true }
    )

    const deleteSocialAccount = () => deleteAccount()?.then(onClose)

    return {
      isLoading,
      isError,
      socialPlatform,
      getAccountToDelete,
      onClose,
      setAccountToDelete,
      isAccountDeleteInProgress,
      extractArrayOfTagNames,
      loadSocialAccounts,
      deleteSocialAccount,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/popups/PopupDeleteSocialAccount';
</style>
