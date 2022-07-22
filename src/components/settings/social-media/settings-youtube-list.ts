import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AxiosError } from 'axios'
import { errorMessagesToString } from '@/services/api'
import { Tags } from '@/types/social-account.model'
import useSocialAccountController from '@/middleware/controllers/useSocialAccountController'
import useYoutubeOAuth from '@/services/youtube'
import useSettingsSocialMediaStore from '@/store/settings-social-media'
import useToastsStore from '@/store/toasts'

const isAccountAddInProgress = ref(false)
const apiErrorMessage = ref('')
const tagsError = ref('')
const tagList = ref<Array<Tags>>([])

export default function useSettingsYoutubeList() {
  const { addYoutubeAccount } = useSocialAccountController()
  const { updateAccounts } = useSettingsSocialMediaStore()
  const { authURL, code, REDIRECT_URL } = useYoutubeOAuth()
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
    router.push({ name: (router.currentRoute.value.meta.backRoute as string) || '' })
    code.value = null
  }

  const addAccount = () => {
    const validationResult = _validateTagsLength(tagList.value)
    _setErrors(validationResult)
    if (validationResult !== true) return

    if (code.value) {
      isAccountAddInProgress.value = true

      addYoutubeAccount({
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
    clearApiErrorMesage,
    authURL,
    tagsError,
    tagList,
  }
}
