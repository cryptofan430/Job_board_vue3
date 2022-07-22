import { ref } from 'vue'
import { resetUrlQuery, useStringUrlParam } from '@/components/helpers/route'
import { paramsToQueryString } from './api'

const _O_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const _CLIENT_ID = '844233871937-fqoe7m3noldn78b7u2gng2u42h6mnna4.apps.googleusercontent.com'
const _RESPONSE_TYPE = 'code'
const _ACCESS_TYPE = 'offline'
const _BASE_SCOPE = ['openid', 'profile', 'email']
const _EXTRA_SCOPE = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/yt-analytics.readonly',
]

const code = ref<string | null>(null)
const authURL = ref<string>('')

const _resetQuery = (hasScopeInUrl: boolean) => {
  if (code.value && hasScopeInUrl) resetUrlQuery()
}

const _setupCode = () => {
  code.value = useStringUrlParam('code') || null
}

const _setupOAuthUrl = (redirectUrl: string) => {
  const oAuthParams = paramsToQueryString({
    client_id: _CLIENT_ID,
    redirect_uri: encodeURIComponent(redirectUrl),
    response_type: _RESPONSE_TYPE,
    scope: encodeURIComponent([..._BASE_SCOPE, ..._EXTRA_SCOPE].join(' ')),
    access_type: _ACCESS_TYPE,
    force_verify: true,
  })

  authURL.value = `${_O_AUTH_URL}${oAuthParams}`
}

const _isScopePresentInUrlQuery = () => {
  const urlScope = useStringUrlParam('scope')

  if (!urlScope) return false
  return _BASE_SCOPE.every((scope) => urlScope.includes(scope))
}

export default function useYoutubeOAuth() {
  const wasRedirectedFromOAuth = _isScopePresentInUrlQuery()
  const REDIRECT_URL = `${window.location.origin}/settings/social-media/youtube/add`

  _setupCode()
  _resetQuery(wasRedirectedFromOAuth)
  _setupOAuthUrl(REDIRECT_URL)

  return {
    authURL,
    code,
    REDIRECT_URL,
    wasRedirectedFromOAuth,
  }
}
