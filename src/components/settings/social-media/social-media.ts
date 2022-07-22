import { computed, ref } from 'vue'
import { AxiosError } from 'axios'
import { resetUrlQuery, useStringUrlParam } from '@/components/helpers/route'
import { errorMessagesToString, getFirstError } from '@/services/api'
import useToastsStore from '@/store/toasts'
import { SocialMediaPlatform, SocialAccountShortInfo } from '@/types/platform.model'
import {
  SocialAccountWithPlatform,
  SocialMediaDeleteErrors,
  SocialMediaEditErrors,
  Tags,
} from '@/types/social-account.model'
import useSettingsSocialMediaStore from '@/store/settings-social-media'
import useSocialAccountController from '@/middleware/controllers/useSocialAccountController'
import { extractArrayOfSocialTags } from '@/components/helpers/social-accounts'

const { setSocialMediaAccountsState, updateAccounts, removeAccountFromList } = useSettingsSocialMediaStore()
const { fetchMySocialAccounts, deleteSocialAccount, editSocialAccount } = useSocialAccountController()

const tagList = ref<Array<Tags>>([])
const tagsError = ref('')
const accountToEdit = ref<SocialAccountWithPlatform | null>(null)
const isAccountEditInProgress = ref(false)
const isEditSocialAccountPopupVisible = computed(() => !!accountToEdit.value)
const getAccountToEdit = computed(() => accountToEdit.value)

const accountToDelete = ref<SocialAccountWithPlatform | null>(null)
const isAccountDeleteInProgress = ref(false)
const isDeleteSocialAccountPopupVisible = computed(() => !!accountToDelete.value)
const getAccountToDelete = computed(() => accountToDelete.value)

const resetTagList = () => {
  tagList.value = []
}

const setAccountToDelete = (account: SocialAccountShortInfo | null, platform?: SocialMediaPlatform) => {
  if (account == null || !platform) {
    accountToDelete.value = null
    return
  }

  accountToDelete.value = { account, platform }
}

const setAccountToEdit = (account: SocialAccountShortInfo | null, platform?: SocialMediaPlatform) => {
  if (account == null || !platform) {
    accountToEdit.value = null
    resetTagList()
    return
  }

  accountToEdit.value = { account, platform }
  tagList.value = extractArrayOfSocialTags(account.tags)
}

const loadSocialAccounts = () => {
  // setSocialMediaAccountsState('loading')

  fetchMySocialAccounts()
    .then((response) => {
      updateAccounts(response.data)
      // setSocialMediaAccountsState('loaded')
    })
    .catch(() => {
      setSocialMediaAccountsState('error')
    })
}

const handleUrlQueryError = () => {
  const { addToast } = useToastsStore()
  const errorParam = useStringUrlParam('error')

  if (errorParam === 'access_denied') addToast('You denied access', 'warning')
  if (errorParam) resetUrlQuery()
}

const deleteAccount = () => {
  if (accountToDelete.value) {
    const { addToast } = useToastsStore()
    const { id, username } = accountToDelete.value.account
    const { platform } = accountToDelete.value

    isAccountDeleteInProgress.value = true

    return deleteSocialAccount(platform, { id })
      .then((response) => {
        updateAccounts(response.data)
        setAccountToDelete(null)
        addToast(`Your account ${username} was successfully unlinked`, 'success')
      })
      .catch((e: AxiosError) => {
        const error = getFirstError<SocialMediaDeleteErrors>(e)
        const errorMessage = errorMessagesToString(e)

        if (error?.errorType === SocialMediaDeleteErrors.SOCIAL_ACCOUNT_NOT_LINKED) {
          removeAccountFromList(id, platform)
        }

        addToast(errorMessage || 'Unexpected error occurred during unlinking account', 'danger')
      })
      .finally(() => {
        isAccountDeleteInProgress.value = false
      })
  }
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

const editAccount = () => {
  const validationResult = _validateTagsLength(tagList.value)
  _setErrors(validationResult)
  if (validationResult !== true) return

  if (accountToEdit.value) {
    const { addToast } = useToastsStore()
    const { id } = accountToEdit.value.account
    const { platform } = accountToEdit.value
    isAccountEditInProgress.value = true

    return editSocialAccount(platform, { id, tags: tagList.value })
      .then((response) => {
        updateAccounts(response.data)
        setAccountToEdit(null)
        resetTagList()
        addToast(`Tags were successfully updated`, 'success')
      })
      .catch((e: AxiosError) => {
        const error = getFirstError<SocialMediaEditErrors>(e)
        const errorMessage = errorMessagesToString(e)

        if (error?.errorType === SocialMediaEditErrors.SOCIAL_ACCOUNT_NOT_LINKED) {
          removeAccountFromList(id, platform)
        }

        addToast(errorMessage || 'Unexpected error occurred during editing account', 'danger')
      })
      .finally(() => {
        isAccountEditInProgress.value = false
      })
  }
}

export default function useSettingsSocialMedia() {
  return {
    isEditSocialAccountPopupVisible,
    isAccountEditInProgress,
    isDeleteSocialAccountPopupVisible,
    isAccountDeleteInProgress,
    getAccountToDelete,
    getAccountToEdit,
    setAccountToDelete,
    setAccountToEdit,
    loadSocialAccounts,
    handleUrlQueryError,
    deleteAccount,
    editAccount,
    tagList,
    tagsError,
    resetTagList,
  }
}
