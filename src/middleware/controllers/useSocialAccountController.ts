import api from '@/services/api'
import { paramsToQueryString } from '@/services/api'
import {
  SocialMediaAccountsForInviteResponse,
  SocialMediaAccountsResponse,
  AccountIdsGroupedByPlatform,
  MySocialAccountsResponse,
  SocialMediaPlatform,
  InvitationsParams,
} from '@/types/platform.model'
import {
  InstagramInsightGrouped,
  InstagramRequest,
  YoutubeRequest,
  DeleteSocialAccountRequest,
  TwitchRequest,
  SocialUpdateRequest,
  InstagramAccountInfo,
  YoutubeMetricsGrouped,
  TikTokRequest,
} from '@/types/social-account.model'

const deleteSocialAccount = async (platform: SocialMediaPlatform, data: DeleteSocialAccountRequest) => {
  return await api.delete<MySocialAccountsResponse>(`social-accounts/${platform}`, { data })
}

const addSocialAccountsFromIds = async (data: AccountIdsGroupedByPlatform) => {
  return await api.post<SocialMediaAccountsResponse>('social-accounts/from-ids', data)
}

const addInstagramAccount = async (data: InstagramRequest) => {
  return await api.post<MySocialAccountsResponse>('social-accounts/add/instagram', data)
}

const addTwitchAccount = async (data: TwitchRequest) => {
  return await api.post<MySocialAccountsResponse>(`social-accounts/add/twitch/`, data)
}

const addTikTokAccount = async (data: TikTokRequest) => {
  return await api.post<MySocialAccountsResponse>(`social-accounts/add/tiktok`, data)
}

const addYoutubeAccount = async (data: YoutubeRequest) => {
  return await api.post<MySocialAccountsResponse>('social-accounts/add/youtube', data)
}

const editSocialAccount = async (platform: SocialMediaPlatform, data: SocialUpdateRequest) => {
  return await api.put<MySocialAccountsResponse>(`social-accounts/update/${platform}`, data)
}

const fetchSocialAccountsToInviteForTask = async (taskId: string, params: InvitationsParams) => {
  return await api.get<SocialMediaAccountsForInviteResponse>(
    `social-accounts/to-invite-for-task/${taskId}${paramsToQueryString(params)}`
  )
}

const fetchMySocialAccounts = async () => {
  return await api.get<MySocialAccountsResponse>('social-accounts/my')
}

const fetchMySocialAccountsToProposeToTask = async (taskId: string) => {
  return await api.get<SocialMediaAccountsResponse>(`social-accounts/my-to-propose-to-task/${taskId}`)
}

const fetchInstagramInsight = async (intagramId: string) => {
  return await api.get<InstagramInsightGrouped>(`social-accounts/instagram/${intagramId}/insight`)
}

const fetchYoutubeInsight = async (youtubeId: string) => {
  return await api.get<YoutubeMetricsGrouped>(`/social-accounts/youtube/${youtubeId}/insight`)
}

const fetchInstagramAccountsFromToken = async (token: string) => {
  return await api.get<Array<InstagramAccountInfo>>(`social-accounts/instagram/from-token/?token=${token}`)
}

export default function useSocialAccountController() {
  return {
    deleteSocialAccount,
    addSocialAccountsFromIds,
    addInstagramAccount,
    addTwitchAccount,
    addTikTokAccount,
    addYoutubeAccount,
    editSocialAccount,
    fetchSocialAccountsToInviteForTask,
    fetchMySocialAccounts,
    fetchMySocialAccountsToProposeToTask,
    fetchInstagramInsight,
    fetchYoutubeInsight,
    fetchInstagramAccountsFromToken,
  }
}
