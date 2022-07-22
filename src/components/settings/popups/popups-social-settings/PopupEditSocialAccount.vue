<template>
  <div class="popup">
    <div class="popup-content">
      <AppSkeleton v-if="isLoading" />
      <AppErrorBox v-else-if="isError" @clicked="loadSocialAccounts">account</AppErrorBox>
      <div v-else-if="!getAccountToEdit" class="popup-main-content">
        <AppBackButton button-text="Back" :back-route="{ name: $route.meta.backRoute }" class="popup-back-button" />
        <AppCloseButton class="popup-close-button" @click="onClose" />
        <AppEmptyBox>No account by the given parameters</AppEmptyBox>
      </div>

      <div v-else class="popup-main-content">
        <AppBackButton button-text="Back" :back-route="{ name: $route.meta.backRoute }" class="popup-back-button" />
        <AppCloseButton class="popup-close-button" @click="onClose" />
        <h3 class="popup-title">Change tags for this account to describe it’s content.</h3>
        <p class="additional-info">Please, select at least 1 tag and at most 2 tags from list.</p>

        <AccountCard
          class="popup-account-card-full"
          :account="getAccountToEdit.account.username"
          :icon="getAccountToEdit.platform.toLowerCase()"
          :tag-list="extractArrayOfTagNames(getAccountToEdit.account.tags)"
          :link="`/insights/${socialPlatform}/${getAccountToEdit?.account.id}`"
        />

        <AppAutocomplete
          v-model="tagList"
          tall
          label-text="Tags"
          :input-id="`tags-${Math.random()}`"
          :max-items="2"
          :options="tagsData"
        />

        <AppInputError v-if="tagsError.length">{{ tagsError }}</AppInputError>

        <AppButton
          class="edit-button action-button"
          :disabled="isAccountEditInProgress"
          :is-loading="isAccountEditInProgress"
          @click="editSocialMediaAccount"
          >Save</AppButton
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import AppCloseButton from '@/components/common/AppCloseButton.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppAutocomplete from '@/components/common/AppAutocomplete.vue'
import AppInputError from '@/components/common/AppInputError.vue'
import AccountCard from '@/components/cards/AccountCard.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppEmptyBox from '@/components/common/AppEmptyBox.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppBackButton from '@/components/common/AppBackButton.vue'
import useSettingsSocialMedia from '../../social-media/social-media'
import useTagsStore from '@/store/tags'
import useTagsController from '@/middleware/controllers/useTagsController'
import useSocialMediaAccounts from '@/store/settings-social-media'
import { extractArrayOfTagNames } from '@/components/helpers/social-accounts'
import { useStringPathParamReactive } from '@/components/helpers/route'
import { useRoute, useRouter } from 'vue-router'
import { SocialMediaPlatform } from '@/types/platform.model'
import { setTitle } from '@/components/helpers/dom'

export default defineComponent({
  name: 'PopupEditSocialAccount',
  components: {
    AppCloseButton,
    AppBackButton,
    AppAutocomplete,
    AppButton,
    AccountCard,
    AppInputError,
    AppSkeleton,
    AppEmptyBox,
    AppErrorBox,
  },
  setup() {
    const { tagsData } = useTagsStore()
    const { fetchTags } = useTagsController()

    fetchTags()

    const {
      getAccountToEdit,
      setAccountToEdit,
      editAccount,
      loadSocialAccounts,
      isAccountEditInProgress,
      tagList,
      tagsError,
    } = useSettingsSocialMedia()

    watch(
      getAccountToEdit,
      (accountToEdit) => {
        if (accountToEdit) {
          setTitle('Freelance Influence | Edit Account ' + accountToEdit.account.username)
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
          const accountToEdit = twitchAccounts.value.find(({ id }) => id === accountId.value) || null
          return setAccountToEdit(accountToEdit, SocialMediaPlatform.TWITCH)
        }
        if (isLoaded.value && socialPlatform.value === 'instagram') {
          const accountToEdit = instagramAccounts.value.find(({ id }) => id === accountId.value) || null
          return setAccountToEdit(accountToEdit, SocialMediaPlatform.INSTAGRAM)
        }
        if (isLoaded.value && socialPlatform.value === 'youtube') {
          const accountToEdit = youtubeAccounts.value.find(({ id }) => id === accountId.value) || null
          return setAccountToEdit(accountToEdit, SocialMediaPlatform.YOUTUBE)
        }
        if (isLoaded.value && socialPlatform.value === 'tiktok') {
          const accountToEdit = tikTokAccounts.value.find(({ id }) => id === accountId.value) || null
          return setAccountToEdit(accountToEdit, SocialMediaPlatform.TIKTOK)
        }
      },
      { immediate: true }
    )

    const editSocialMediaAccount = () => editAccount()?.then(onClose)

    return {
      isLoading,
      socialPlatform,
      onClose,
      isError,
      getAccountToEdit,
      loadSocialAccounts,
      setAccountToEdit,
      editSocialMediaAccount,
      isAccountEditInProgress,
      tagsData,
      tagList,
      tagsError,
      extractArrayOfTagNames,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/popups/PopupEditSocialAccount';
</style>
