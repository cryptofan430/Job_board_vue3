import { SocialMediaPlatform } from './platform.model'
import { TaskPublicInfo } from './tasks.model'

export interface InvitaionParams {
  taskId: string
  socialAccountId: string
  platform: SocialMediaPlatform
}

export interface InvitationPublicInfo {
  id: string
  taskId: string
  socialAccountId: string
  platform: SocialMediaPlatform
  date: string
}

export interface InvitationsToMeResponse {
  invitations: Array<InvitationSentToMe>
  count: number
}

export interface InvitationSentToMe {
  id: string
  task: TaskPublicInfo
  socialAccountId: string
  socialAccountUsername: string
  platform: SocialMediaPlatform
  date: string
}

export enum InvitationCreateError {
  TASK_NOT_EXIST = 'TASK_NOT_EXIST',
  TASK_NOT_BELONG_TO_USER = 'TASK_NOT_BELONG_TO_USER',
  SOCIAL_ACCOUNT_NOT_EXIST = 'SOCIAL_ACCOUNT_NOT_EXIST',
  UNABLE_TO_INVITE_MYSELF = 'UNABLE_TO_INVITE_MYSELF',
  INVITATION_ALREADY_SENT = 'INVITATION_ALREADY_SENT',
  SOCIAL_ACCOUNT_ALREADY_IN_PROPOSALS = 'SOCIAL_ACCOUNT_ALREADY_IN_PROPOSALS',
  INVITATIONS_LIMIT_REACHED = 'INVITATIONS_LIMIT_REACHED',
}
