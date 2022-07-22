import { SocialMediaPlatform } from './platform.model'

export enum NotificationType {
  PROPOSAL_ADDED = 'PROPOSAL_ADDED',
  CONTRACT_CREATED = 'CONTRACT_CREATED',
  CONTRACT_ACCEPTED = 'CONTRACT_ACCEPTED',
  CONTRACT_ENDED = 'CONTRACT_ENDED',
  MILESTONES_CREATED = 'MILESTONES_CREATED',
  MILESTONE_SECURED = 'MILESTONE_SECURED',
  MILESTONE_RELEASED = 'MILESTONE_RELEASED',
  INVITATION_CREATED = 'INVITATION_CREATED',
  SOCIAL_ACCOUNT_UNLINKED = 'SOCIAL_ACCOUNT_UNLINKED',
  STRIPE_PAYMENT_SUCCEEDED = 'STRIPE_PAYMENT_SUCCEEDED',
}

export interface NotificationsResponse {
  notifications: NotificationPayload
  count: number
}

export type NotificationPublicInfo =
  | ProposalNotification
  | ContractNotification
  | MilestoneNotification
  | InvitationNotification
  | SocialAccountUnlinkNotification

export type NotificationWithTypeInfo = NotificationPublicInfo & {
  notificationType: NotificationType
}

export type NotificationPayload = Record<NotificationType, Array<NotificationPublicInfo>>

export interface ProposalNotification {
  id: string
  taskId: string
  proposalId: string
  read: boolean
  date: string
  message: string
}

export interface ContractNotification {
  id: string
  taskId: string
  contractId: string
  read: boolean
  date: string
  message: string
}

export interface MilestoneNotification {
  id: string
  taskId: string
  invitationId: string
  read: boolean
  date: string
  message: string
}

export interface InvitationNotification {
  id: string
  taskId: string
  invitationId: string
  read: boolean
  date: string
  message: string
}

export interface SocialAccountUnlinkNotification {
  id: string
  accountName: string
  socialMediaPlatform: SocialMediaPlatform
  read: boolean
  date: string
  message: string
}
