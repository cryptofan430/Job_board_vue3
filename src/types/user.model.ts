import { SimpleAccessFile } from './file.model'
import { CurrencyValue } from './money.model'

export enum ClientUserState {
  INFLUENCER = 'INFLUENCER',
  MARKETER = 'MARKETER',
}

export interface UserResponseWithJWT {
  token?: string
  user: UserPublicInfo
}

export interface UpdateMyProfileRequest {
  avatarImageFileId: string
}

export interface UserPublicInfo {
  id: string
  email: string
  money: Array<CurrencyValue>
  marketer: UserStatePublicInfo
  marketerInvoiceDetails: UserInvoiceDetailPublicInfo
  influencer: UserStatePublicInfo
  influencerInvoiceDetails: UserInvoiceDetailPublicInfo
}

export interface UserToLogin {
  email: string
  password: string
  rememberMe: boolean
}

export interface UserToRegister {
  password: string
  firstName: string
  lastName: string
  email: string
}

export interface UserStatePublicInfo {
  firstName: string
  lastName: string
  description: string
  avatarSimpleAccessFile: SimpleAccessFile
  rating: number
  moneyTransferred: number
  location?: string
  registerDate: string
}

export interface UserInvoiceDetailPublicInfo {
  city: string
  country: string
  name: string
  streetAddress: string
  vatId: string
  zipCode: string
}

export interface UpdateInfluencerData {
  firstName: string
  lastName: string
  location: string
  description: string
  avatarImageFileId: string | null
}

export interface UpdateMarketerData {
  firstName: string
  lastName: string
  description: string
  avatarImageFileId: string | null
}

export interface UpdateMarketerInvoiceData {
  city: string
  country: string
  name: string
  streetAddress: string
  vatId: string
  zipCode: string
}

export interface UpdateInfluencerInvoiceData {
  city: string
  country: string
  name: string
  streetAddress: string
  vatId: string
  zipCode: string
}

export interface UserToRegisterWithConfirmPassword extends UserToRegister {
  confirmPassword: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
}

export enum LoginError {
  WRONG_CREDENTIALS = 'WRONG_CREDENTIALS',
  VERIFICATION_PENDING = 'VERIFICATION_PENDING',
}

export enum RegistrationError {
  EMAIL_ADDRESS_ALREADY_REGISTERED = 'EMAIL_ADDRESS_ALREADY_REGISTERED',
}

export enum VerificationError {
  EMAIL_TOKEN_INVALID = 'EMAIL_TOKEN_INVALID',
  USER_NOT_EXIST = 'USER_NOT_EXIST',
  EMAIL_VERIFIED_ALREADY = 'EMAIL_VERIFIED_ALREADY',
}

export enum PasswordResetRequestError {
  EMAIL_ADDRESS_NOT_REGISTERED = 'EMAIL_ADDRESS_NOT_REGISTERED',
}

export enum PasswordResetError {
  EMAIL_TOKEN_INVALID = 'EMAIL_TOKEN_INVALID',
  USER_NOT_EXIST = 'USER_NOT_EXIST',
}
