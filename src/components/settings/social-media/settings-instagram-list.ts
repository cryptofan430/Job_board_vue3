import { AxiosError } from 'axios'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { errorMessagesToString } from '@/services/api'
import { InstagramAccountInfo, Tags } from '@/types/social-account.model'
import { ApiLoadingState, EntitiesLoadingState } from '@/types/api.model'
import { extractEntitiesLoadingState } from '@/components/helpers/state'
import useSocialAccountController from '@/middleware/controllers/useSocialAccountController'
import useFacebookOAuth from '@/services/facebook'
import useSettingsSocialMediaStore from '@/store/settings-social-media'
import useToastsStore from '@/store/toasts'

const isAccountAddInProgress = ref(false)
const apiErrorMessage = ref('')
const tagsError = ref('')
const tagList = ref<Array<Tags>>([])
const instagramAccounts = ref<Array<InstagramAccountInfo>>([])
const instagramAccountsState = reactive<EntitiesLoadingState>({
  state: 'loaded',
  payload: {
    message: undefined,
  },
})
const { isError, isLoading, isLoaded } = extractEntitiesLoadingState(instagramAccountsState)
const selectedAccount = ref<InstagramAccountInfo | null>(null)
const isAccountSelected = computed(() => !!selectedAccount.value)

const setInstagramAccounts = (accounts: Array<InstagramAccountInfo>) => {
  instagramAccounts.value = accounts
}

const setInstagramAccountsState = (state: ApiLoadingState, payload?: { message?: string }) => {
  instagramAccountsState.state = state
  instagramAccountsState.payload = payload
}

const selectAccount = (account: InstagramAccountInfo | null) => {
  selectedAccount.value = account
}

const reset = () => {
  setInstagramAccounts([])
  instagramAccountsState.state = 'loaded'
  instagramAccountsState.payload = {
    message: undefined,
  }
}

export default function useSettingsInstagramList() {
  const { addInstagramAccount, fetchInstagramAccountsFromToken } = useSocialAccountController()
  const { updateAccounts } = useSettingsSocialMediaStore()
  const { authURL, token, wasRedirectedFromOAuth } = useFacebookOAuth()
  const { addToast } = useToastsStore()
  const router = useRouter()

  const loadInstagramAccounts = () => {
    if (!token.value || !wasRedirectedFromOAuth || isLoading.value) return

    setInstagramAccountsState('loading')

    fetchInstagramAccountsFromToken(token.value)
      .then((response) => {
        setInstagramAccounts(response.data)
        setInstagramAccountsState('loaded')
      })
      .catch(() => {
        setInstagramAccountsState('error')
      })
  }

  const clearApiErrorMesage = () => {
    apiErrorMessage.value = ''
  }

  const _validateTagsLength = (array: Array<Tags>) => {
    if (!Array.isArray(array)) return 'Select tags from list'
    if (array.length > 2 || array.length === 0) return 'You must select between 1 and 2 tags from list'
    return true
  }

  const _setErrors = (error: boolean | string) => {
    if (typeof error === 'string') tagsError.value = error
    else tagsError.value = ''
  }

  const closePopup = () => {
    router.push({ name: 'SettingsSocialMedia' })
    token.value = null
    isAccountAddInProgress.value = false
    instagramAccounts.value = []
    setInstagramAccountsState('loading')
    reset()
  }

  const addAccount = () => {
    const validationResult = _validateTagsLength(tagList.value)
    _setErrors(validationResult)
    if (validationResult !== true) return
    const accessToken = token.value

    if (accessToken && selectedAccount.value) {
      isAccountAddInProgress.value = true

      addInstagramAccount({
        token: String(accessToken),
        tags: tagList.value,
        platformId: selectedAccount.value.platformId,
      })
        .then((response) => {
          updateAccounts(response.data)
          closePopup()
          addToast('Successfully added social media account', 'success')
        })
        .catch((error: AxiosError) => {
          apiErrorMessage.value = errorMessagesToString(error)
        })
        .finally(() => {
          isAccountAddInProgress.value = false
        })
    }
  }

  const initOAuth = () => {
    window.location.href = authURL.value
  }

  return {
    closePopup,
    initOAuth,
    addAccount,
    isAccountAddInProgress,
    apiErrorMessage,
    clearApiErrorMesage,
    authURL,
    tagsError,
    tagList,
    isError,
    isLoading,
    isLoaded,
    instagramAccounts,
    loadInstagramAccounts,
    reset,
    selectAccount,
    isAccountSelected,
  }
}
