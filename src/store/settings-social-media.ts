import { computed, reactive, ref } from 'vue'
import { MySocialAccountsResponse, SocialMediaPlatform, SocialAccountShortInfo } from '@/types/platform.model'
import { ApiLoadingState, EntitiesLoadingState } from '@/types/api.model'
import { extractEntitiesLoadingState } from '@/components/helpers/state'

const socialMediaAccounts = ref<MySocialAccountsResponse | null>(null)
const socialMediaAccountsState = reactive<EntitiesLoadingState>({
  state: 'loaded',
  payload: {
    message: undefined,
  },
})
const { isError, isLoading, isLoaded } = extractEntitiesLoadingState(socialMediaAccountsState)

const setSocialMediaAccountsState = (state: ApiLoadingState, payload?: { message?: string }) => {
  socialMediaAccountsState.state = state
  socialMediaAccountsState.payload = payload
}

const instagramAccounts = computed<Array<SocialAccountShortInfo>>(() => {
  if (!socialMediaAccounts.value?.accounts.INSTAGRAM) return []
  return [
    ...socialMediaAccounts.value.accounts.INSTAGRAM.requested,
    ...socialMediaAccounts.value.accounts.INSTAGRAM.verified,
  ]
})

const twitchAccounts = computed<Array<SocialAccountShortInfo>>(() => {
  if (!socialMediaAccounts.value?.accounts.TWITCH) return []
  return [...socialMediaAccounts.value.accounts.TWITCH.requested, ...socialMediaAccounts.value.accounts.TWITCH.verified]
})

const youtubeAccounts = computed<Array<SocialAccountShortInfo>>(() => {
  if (!socialMediaAccounts.value?.accounts.YOUTUBE) return []
  return [
    ...socialMediaAccounts.value.accounts.YOUTUBE.requested,
    ...socialMediaAccounts.value.accounts.YOUTUBE.verified,
  ]
})

const tikTokAccounts = computed<Array<SocialAccountShortInfo>>(() => {
  if (!socialMediaAccounts.value?.accounts.TIKTOK) return []
  return [...socialMediaAccounts.value.accounts.TIKTOK.requested, ...socialMediaAccounts.value.accounts.TIKTOK.verified]
})

const updateAccounts = (accounts: MySocialAccountsResponse | null) => {
  socialMediaAccounts.value = accounts
}

const removeAccountFromList = (accountId: string, platform: SocialMediaPlatform) => {
  let index = socialMediaAccounts.value?.accounts[platform]?.requested.findIndex((e) => e.id === accountId)

  if (index !== undefined && index >= 0) {
    socialMediaAccounts.value?.accounts[platform]?.requested.splice(index, 1)
    return
  }

  index = socialMediaAccounts.value?.accounts[platform]?.verified.findIndex((e) => e.id === accountId)

  if (index !== undefined && index >= 0) {
    socialMediaAccounts.value?.accounts[platform]?.verified.splice(index, 1)
  }
}

const reset = () => {
  socialMediaAccounts.value = null
  socialMediaAccountsState.state = 'loaded'
  socialMediaAccountsState.payload = {
    message: undefined,
  }
}

export default function useSettingsSocialMediaStore() {
  return {
    setSocialMediaAccountsState,
    instagramAccounts,
    twitchAccounts,
    youtubeAccounts,
    tikTokAccounts,
    isLoading,
    isLoaded,
    isError,
    removeAccountFromList,
    updateAccounts,
    reset,
  }
}
