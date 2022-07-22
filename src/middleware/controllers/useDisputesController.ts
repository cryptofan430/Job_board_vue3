import api, { paramsToQueryString } from '@/services/api'
import { BasicPagination } from '@/types/api.model'
import {
  AdminDisputePagination,
  CreateDisputeForm,
  DisputeAdminInfo,
  DisputeFullAdminInfo,
  DisputePublicInfo,
  DisputesAdminResponse,
  DisputesPublicResponse,
} from '@/types/disputes'

// TODO: right now there no difference between marketer and influencer disputes
const getMarketerDisputes = (params?: BasicPagination) => {
  return api.get<DisputesPublicResponse>(`disputes/my/${paramsToQueryString(params)}`)
}

const getInfluencerDisputes = (params?: BasicPagination) => {
  return api.get<DisputesPublicResponse>(`disputes/my/${paramsToQueryString(params)}`)
}

const getAdminDisputes = (params?: AdminDisputePagination) => {
  return api.get<DisputesAdminResponse>(`disputes/${paramsToQueryString(params)}`)
}

const openDispute = (contractId: string, milestoneId: string) => {
  return api.post<DisputePublicInfo>(`/disputes/${contractId}/create/${milestoneId}`)
}

const closeDispute = (disputeId: string, closeDisputePayload: CreateDisputeForm) => {
  return api.post<DisputeAdminInfo>(`/disputes/${disputeId}/close/${paramsToQueryString(closeDisputePayload)}`)
}

const adminJoinRegularChat = (disputeId: string) => {
  return api.post<DisputeAdminInfo>(`disputes/${disputeId}/join-regular-chat`)
}

const adminJoinDisputeChat = (disputeId: string) => {
  return api.post<DisputeAdminInfo>(`disputes/${disputeId}/join-dispute-chat`)
}

const getAdminDispute = (disputeId: string) => {
  return api.get<DisputeAdminInfo>(`/disputes/${disputeId}`)
}

const getFullAdminDispute = (disputeId: string) => {
  return api.get<DisputeFullAdminInfo>(`/disputes/${disputeId}/full-info`)
}

export default function useDisputesController() {
  return {
    getFullAdminDispute,
    getMarketerDisputes,
    adminJoinRegularChat,
    adminJoinDisputeChat,
    getInfluencerDisputes,
    getAdminDisputes,
    getAdminDispute,
    closeDispute,
    openDispute,
  }
}
