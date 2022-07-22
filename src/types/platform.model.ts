import { Tags } from './social-account.model'
import { SocialTagWithName } from './social-account.model'

export enum SocialMediaPlatform {
  INSTAGRAM = 'INSTAGRAM',
  YOUTUBE = 'YOUTUBE',
  TWITCH = 'TWITCH',
  TIKTOK = 'TIKTOK',
  OTHER = 'OTHER',
}

export enum TaskSocialMediaPlatform {
  INSTAGRAM = 'INSTAGRAM',
  YOUTUBE = 'YOUTUBE',
  TWITCH = 'TWITCH',
  TIKTOK = 'TIKTOK',
  OTHER = 'OTHER',
}

export interface MySocialAccountsResponse {
  accounts: PlatformsWithSocialMeadiaAccounts
}

export type PlatformsWithSocialMeadiaAccounts = Partial<
  Record<SocialMediaPlatform, SocialAccountIdsWithUsernameGroupedByVerify>
>

export interface SocialAccountIdsWithUsernameGroupedByVerify {
  requested: Array<SocialAccountShortInfo>
  verified: Array<SocialAccountShortInfo>
}

export interface SocialAccountShortInfo {
  username: string
  id: string
  tags: Array<SocialTagWithName>
  enabledForProposalsDate: string
}

export type AccountIdsGroupedByPlatform = Partial<Record<SocialMediaPlatform, Array<string>>>

export interface UsernameAccountRequest {
  username: string
}

export interface SocialMediaAccountAddResponse {
  accountId: string
}

export interface CodeToVerify {
  code: string
  accountId: string
}

export interface SocialMediaAccountsResponse {
  instagram: Array<InstagramPublicInfo>
  youtube: Array<YoutubePublicInfo>
  twitch: Array<TwitchPublicInfo>
}

export interface InstagramPublicInfo {
  id: string
  username: string
  platformId: number
  accountLinked: boolean
  enabledForProposalsDate: string
  rating: number
  tags: Array<Tags>
}
export type YoutubePublicInfo = InstagramPublicInfo
export type TwitchPublicInfo = InstagramPublicInfo

export interface InstagramAccountForProposal {
  id: string
  username: string
  platformId: string
  userId: string
  invited: boolean
  enabled: boolean
  tags: Array<Tags>
  rating: number
  moneyEarned: number
  enabledForProposalsDate: string
}

type YoutubeAccountForProposal = InstagramAccountForProposal // change if they differ
type TwitchAccountForProposal = InstagramAccountForProposal
type TikTokAccountForProposal = InstagramAccountForProposal

export interface SocialAccountsForProposal {
  instagram: Array<InstagramAccountForProposal>
  youtube: Array<YoutubeAccountForProposal>
  twitch: Array<TwitchAccountForProposal>
  tiktok: Array<TikTokAccountForProposal>
}

export interface SocialMediaAccountsForInviteResponse {
  instagram: Array<InstagramForInviteResponse>
  youtube: Array<YoutubeForInviteResponse>
  twitch: Array<TwitchForInviteResponse>
  tiktok: Array<TikTokInviteResponse>
  count: number
}

export interface InstagramForInviteResponse {
  id: string
  audience: number
  username: string
  invited: boolean
  proposed: boolean
  tags: SocialTagWithName[]
  rating: number | null
}
export type YoutubeForInviteResponse = InstagramForInviteResponse // change when they differ
export type TwitchForInviteResponse = InstagramForInviteResponse
export type TikTokInviteResponse = InstagramForInviteResponse
export interface InvitationWithPlatform {
  invitation: InstagramForInviteResponse | YoutubeForInviteResponse | TwitchForInviteResponse | TikTokInviteResponse
  platform: SocialMediaPlatform
  isProcessing?: boolean
}

export interface InvitationsParams {
  olderThanId?: string
  limit: number
  tags?: Tags[]
  socialPlatforms: SocialMediaPlatform[]
}

export interface TaskInvitationsFilters {
  tags?: Array<Tags>
  socialPlatforms?: Array<SocialMediaPlatform>
}

export interface SocialAccountsParams {
  limit: number
  lastInstagramId?: string
  lastYoutubeId?: string
  lastTwitchId?: string
}
