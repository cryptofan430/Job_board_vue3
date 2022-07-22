import { computed, ref } from 'vue'
import { AxiosError } from 'axios'
import useSocialAccountController from '@/middleware/controllers/useSocialAccountController'
import { errorMessagesToString } from '@/services/api'
import useTwitchOAuth from '@/services/twitch'
import useSocialMediaAccounts from '@/store/settings-social-media'
import { Tags } from '@/types/social-account.model'
import useToastsStore from '@/store/toasts'
import { useRouter } from 'vue-router'

const isAccountAddInProgress = ref(false)
const apiErrorMessage = ref('')
const tagsError = ref('')
const tagList = ref<Array<Tags>>([])

export default function useSettingsTwitchList() {
  const { addTwitchAccount } = useSocialAccountController()
  const { updateAccounts } = useSocialMediaAccounts()
  const { authURL, code, REDIRECT_URL } = useTwitchOAuth()
  const { addToast } = useToastsStore()
  const router = useRouter()

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
    code.value = null
  }

  const hasInitedOauth = computed(() => !!code.value)

  const addAccount = () => {
    const validationResult = _validateTagsLength(tagList.value)
    _setErrors(validationResult)
    if (validationResult !== true) return

    if (code.value) {
      isAccountAddInProgress.value = true

      addTwitchAccount({
        code: code.value,
        tags: tagList.value,
        redirectUrl: REDIRECT_URL,
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
    hasInitedOauth,
    clearApiErrorMesage,
    authURL,
    tagsError,
    tagList,
  }
}
