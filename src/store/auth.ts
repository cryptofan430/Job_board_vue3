import { ref, watch } from 'vue'

const AUTH_ITEM = 'isUserAuthenticated'
const ACCOUNT_TYPE = 'accountType'
const isAuthenticated = ref(false)
const accountType = ref<'marketer' | 'influencer' | null>(null)

const _updateAuthStateInLS = () => {
  localStorage.setItem(AUTH_ITEM, JSON.stringify(isAuthenticated.value))
}

const _loadAuthStateFromLS = () => {
  const ls = localStorage.getItem(AUTH_ITEM)

  if (ls && typeof JSON.parse(ls) === 'boolean') isAuthenticated.value = JSON.parse(ls)
  else _updateAuthStateInLS()
}

_loadAuthStateFromLS()
watch(isAuthenticated, _updateAuthStateInLS)

const _updateAccountTypeInLS = () => {
  localStorage.setItem(ACCOUNT_TYPE, JSON.stringify(accountType.value))
}

const _loadAccountTypeFromLS = () => {
  const ls = localStorage.getItem(ACCOUNT_TYPE)

  if (ls) accountType.value = JSON.parse(ls)
  else _updateAccountTypeInLS()
}

_loadAccountTypeFromLS()
watch(accountType, _updateAccountTypeInLS)

const reset = () => {
  isAuthenticated.value = false
  accountType.value = null
}

export default function useAuthStore() {
  return {
    isAuthenticated,
    accountType,
    reset,
  }
}
