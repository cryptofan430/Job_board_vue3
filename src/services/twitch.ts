import { ref } from 'vue'
import { resetUrlQuery, useStringUrlParam } from '@/components/helpers/route'
import { paramsToQueryString } from './api'

const _O_AUTH_URL = 'https://id.twitch.tv/oauth2/authorize'
const _CLIENT_ID = 'bzlc0z48iekemxkc1l189a74f32dfw'
const _RESPONSE_TYPE = 'code'
const _SCOPE = 'user:read:email'

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
    scope: _SCOPE,
    force_verify: true,
  })

  authURL.value = `${_O_AUTH_URL}${oAuthParams}`
}

const _isScopePresentInUrlQuery = () => {
  return useStringUrlParam('scope') === _SCOPE
}

export default function useTwitchOAuth() {
  const wasRedirectedFromOAuth = _isScopePresentInUrlQuery()
  const REDIRECT_URL = `${window.location.origin}/settings/social-media/twitch/add`

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
