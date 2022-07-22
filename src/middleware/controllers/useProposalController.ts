import api, { paramsToQueryString } from '@/services/api'
import { BasicPagination } from '@/types/api.model'
import {
  ProposalPublicInfo,
  ProposalsMyAllResponse,
  ProposalsResponse,
  ProposalToAdd,
  ProposalUpdateData,
} from '@/types/proposal.model'

const addProposal = async (proposal: ProposalToAdd) => {
  return await api.post<ProposalPublicInfo>('proposals', proposal)
}

const deleteProposal = async (id: string) => {
  return api.delete<Record<string, never>>(`proposals/${id}`)
}

const updateProposal = async (data: ProposalUpdateData) => {
  return await api.put<ProposalPublicInfo>('proposals', data)
}

const fetchProposalsFromTask = async (taskId: string, isTaskMine: boolean) => {
  if (isTaskMine) {
    return await api.get<ProposalsResponse>(`proposals/from-task/${taskId}`)
  } else {
    return await api.get<ProposalsResponse>(`proposals/from-task/${taskId}/my`)
  }
}

const fetchProposalsForTask = async (taskId: string, params?: BasicPagination) => {
  return await api.get<ProposalsResponse>(`proposals/from-task/${taskId}/${paramsToQueryString(params)}`)
}

const fetchMyProposalsForTask = async (taskId: string) => {
  return await api.get<ProposalsResponse>(`proposals/from-task/${taskId}/my`)
}

const fetchMyProposals = async (params?: BasicPagination) => {
  return await api.get<ProposalsMyAllResponse>(`proposals/${paramsToQueryString(params)}`)
}

const fetchProposalById = async (proposalId: string) => {
  return await api.get<ProposalPublicInfo>(`/proposals/${proposalId}`)
}

export default function useProposalController() {
  return {
    addProposal,
    fetchMyProposalsForTask,
    fetchProposalById,
    deleteProposal,
    updateProposal,
    fetchProposalsFromTask,
    fetchMyProposals,
    fetchProposalsForTask,
  }
}
