import { ref } from 'vue'
import { resetUrlQuery, useStringUrlParam } from '@/components/helpers/route'
import { getEnvironmentVariable } from '@/components/helpers/system'
import { paramsToQueryString } from './api'

const tikTokClientId = getEnvironmentVariable('VUE_APP_TIK_TOK_CLIENT_ID')
const scope = 'user.info.basic'
const responseType = 'code'
const oauthUrl = 'https://open-api.tiktok.com/platform/oauth/connect/'

const code = ref<string | null>(null)
const authURL = ref<string>('')

const resetQuery = (hasScopeInUrl: boolean) => {
  if (code.value && hasScopeInUrl) resetUrlQuery()
}

const setupCode = () => {
  code.value = useStringUrlParam('code') || null
}

const setupOAuthUrl = (redirectUrl: string) => {
  const oAuthParams = paramsToQueryString({
    client_key: tikTokClientId,
    redirect_uri: encodeURIComponent(redirectUrl),
    response_type: responseType,
    scope: scope,
  })

  authURL.value = `${oauthUrl}${oAuthParams}`
}

const isScopePresentInUrlQuery = () => {
  return useStringUrlParam('scopes') === scope
}

export default function useTikTokOAuth() {
  const wasRedirectedFromOAuth = isScopePresentInUrlQuery()
  const REDIRECT_URL = `${window.location.origin}/settings/social-media/tiktok/add`

  setupCode()
  resetQuery(wasRedirectedFromOAuth)
  setupOAuthUrl(REDIRECT_URL)

  return {
    authURL,
    code,
    REDIRECT_URL,
    wasRedirectedFromOAuth,
  }
}
