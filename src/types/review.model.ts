export interface ReviewToAddForMarketer {
  description: string
  userRating: number
}

export interface SocialMediaAccountRatings {
  [key: string]: SocialMediaRatings
}

export interface SocialMediaRatings {
  [key: string]: number
}

export interface ReviewToAddForInfluencer {
  description: string
  userRating: number
  socialAccountRatings: SocialMediaAccountRatings
}

export interface MarketerReview {
  id: string
  userId: string
  reviewerId: string
  contractId: string
  addedTime: string
  description?: string
  rating: number
}

export interface InfluencerReview {
  id?: string
  userId: string
  reviewerId: string
  contractId: string
  addedTime: string
  description: string
  socialRatings: SocialMediaAccountRatings
  userRating: number
}

export enum AddMarketerReviewError {
  CONTRACT_ALREADY_REVIEWED = 'CONTRACT_ALREADY_REVIEWED',
  CONTRACT_NOT_EXIST = 'CONTRACT_NOT_EXIST',
  CONTRACT_NOT_ENDED = 'CONTRACT_NOT_ENDED',
  CONTRACT_NOT_BELONG_TO_USER = 'CONTRACT_NOT_BELONG_TO_USER',
}

export enum AddInfluencerReviewError {
  CONTRACT_ALREADY_REVIEWED = 'CONTRACT_ALREADY_REVIEWED',
  CONTRACT_NOT_EXIST = 'CONTRACT_NOT_EXIST',
  CONTRACT_NOT_ENDED = 'CONTRACT_NOT_ENDED',
  SOCIAL_ACCOUNT_NOT_EXIST = 'SOCIAL_ACCOUNT_NOT_EXIST',
  CONTRACT_NOT_BELONG_TO_USER = 'CONTRACT_NOT_BELONG_TO_USER',
}
