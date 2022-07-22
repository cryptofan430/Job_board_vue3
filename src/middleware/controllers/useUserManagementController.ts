import api from '@/services/api'
import useUserStore from '@/store/user'
import {
  UpdateInfluencerData,
  UpdateMarketerData,
  UpdateMyProfileRequest,
  UserPublicInfo,
  UpdateMarketerInvoiceData,
  UpdateInfluencerInvoiceData,
  UserInvoiceDetailPublicInfo,
} from '@/types/user.model'
import { CurrencyValue, ExchangeFundsRequest } from '@/types/money.model'

const { setMyProfile } = useUserStore()

const fetchUser = async (id: string) => {
  return await api.get<UserPublicInfo>(`users/${id}`)
}

const fetchUserMyProfile = async () => {
  return await api.get<UserPublicInfo>('users/me').then((response) => {
    setMyProfile(response.data)
    return response
  })
}

const updateUserMyProfile = async (data: UpdateMyProfileRequest) => {
  return await api.put<UserPublicInfo>('users', data).then((response) => {
    setMyProfile(response.data)
    return response
  })
}

const depositFunds = async (data: CurrencyValue) => {
  return await api.post<UserPublicInfo>('users/deposit-funds', data).then((response) => {
    setMyProfile(response.data)
    return response
  })
}

const exchangeFunds = async (data: ExchangeFundsRequest) => {
  return await api.post<UserPublicInfo>('users/exchange-funds', data).then((response) => {
    setMyProfile(response.data)
    return response
  })
}

const verifyEmail = async (token: string) => {
  return await api.post<Record<string, never>>(`users/verify-email/${token}`)
}

const updateInfluencerProfile = async (data: UpdateInfluencerData) => {
  return await api.post<UserPublicInfo>('users/update/INFLUENCER', data)
}

const updateMarketerProfile = async (data: UpdateMarketerData) => {
  return await api.post<UserPublicInfo>('users/update/MARKETER', data)
}

const updateMarketerTaxInfo = async (data: UpdateMarketerInvoiceData) => {
  return await api.post<UserInvoiceDetailPublicInfo>('users/MARKETER/update-invoice-details', data)
}

const updateInfluencerTaxInfo = async (data: UpdateInfluencerInvoiceData) => {
  return await api.post<UserInvoiceDetailPublicInfo>('users/INFLUENCER/update-invoice-details', data)
}

export default function useUserManagementController() {
  return {
    fetchUser,
    fetchUserMyProfile,
    updateUserMyProfile,
    depositFunds,
    exchangeFunds,
    verifyEmail,
    updateInfluencerProfile,
    updateMarketerProfile,
    updateMarketerTaxInfo,
    updateInfluencerTaxInfo,
  }
}
