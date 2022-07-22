import { ref } from 'vue'
import { resetUrlQuery, useStringUrlHashParam } from '@/components/helpers/route'
import { paramsToQueryString } from './api'

const _O_AUTH_URL = 'https://www.facebook.com/v11.0/dialog/oauth'
const _CLIENT_ID = '452432002416934'
const _RESPONSE_TYPE = 'token'
const _DISPLAY = 'popup'
const _SCOPE = [
  'public_profile',
  'email',
  'instagram_basic',
  'instagram_manage_insights',
  'pages_read_engagement',
  'pages_show_list',
  'business_management',
]

const token = ref<string | null>(null)
const authURL = ref<string>('')

const _resetQuery = (hasScopeInUrl: boolean) => {
  if (token.value && hasScopeInUrl) resetUrlQuery()
}

const _setupToken = () => {
  token.value = useStringUrlHashParam('access_token') || null
}

const _setupOAuthUrl = (redirectUrl: string) => {
  const oAuthParams = paramsToQueryString({
    client_id: _CLIENT_ID,
    redirect_uri: encodeURIComponent(redirectUrl),
    response_type: _RESPONSE_TYPE,
    display: _DISPLAY,
    scope: _SCOPE.join(','),
    force_confirmation: true,
  })

  authURL.value = `${_O_AUTH_URL}${oAuthParams}`
}

const _isAccessTokenPresentInUrlQuery = () => {
  const urlToken = useStringUrlHashParam('access_token')
  if (!urlToken) return false
  return true
}

export default function useFacebookOAuth() {
  const wasRedirectedFromOAuth = _isAccessTokenPresentInUrlQuery()
  const REDIRECT_URL = `${window.location.origin}/settings/social-media/instagram/add`

  _setupToken()
  _resetQuery(wasRedirectedFromOAuth)
  _setupOAuthUrl(REDIRECT_URL)

  return {
    authURL,
    token,
    REDIRECT_URL,
    wasRedirectedFromOAuth,
  }
}
