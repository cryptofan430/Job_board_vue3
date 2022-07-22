import api from '@/services/api'
import { paramsToQueryString } from '@/services/api'
import { BasicPagination } from '@/types/api.model'
import { InvitaionParams, InvitationPublicInfo, InvitationsToMeResponse } from '@/types/invitation.model'

export default function useInvitationController() {
  const addInvitation = async (params: InvitaionParams) => {
    return await api.post<InvitationPublicInfo>(`invitations/${paramsToQueryString(params)}`)
  }

  const fetchInvitations = async (params?: BasicPagination) => {
    return await api.get<InvitationsToMeResponse>(`invitations/${paramsToQueryString(params)}`)
  }

  return {
    addInvitation,
    fetchInvitations,
  }
}
