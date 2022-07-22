import api, { paramsToQueryString } from '@/services/api'
import { BasicPagination } from '@/types/api.model'
import {
  ContractMilestoneToAddRequest,
  ContractPublicInfo,
  ContractsMyAllResponse,
  ContractsResponse,
  ContractToCreate,
  ContractWithTask,
} from '@/types/contract.model'

export default function useContractController() {
  const addContract = async (contract: ContractToCreate) => {
    return await api.post<ContractPublicInfo>('contracts', contract)
  }

  const acceptContract = async (id: string) => {
    return await api.post<ContractPublicInfo>(`contracts/${id}/accept`)
  }

  const endContract = async (id: string) => {
    return await api.post<ContractPublicInfo>(`contracts/${id}/end`)
  }

  const deleteContract = async (id: string) => {
    return await api.delete<Record<string, never>>(`contracts/${id}`)
  }

  const fetchContractsForTask = async (taskId: string, params?: BasicPagination) => {
    return await api.get<ContractsResponse>(`contracts/tasks/${taskId}/contracts/${paramsToQueryString(params)}`)
  }

  const fetchInfluencerContracts = async (params?: BasicPagination) => {
    return await api.get<ContractsMyAllResponse>(
      `contracts/from-client-user-state/INFLUENCER/my/${paramsToQueryString(params)}`
    )
  }

  const fetchMarketerContracts = async (params?: BasicPagination) => {
    return await api.get<ContractsMyAllResponse>(
      `contracts/from-client-user-state/MARKETER/my/${paramsToQueryString(params)}`
    )
  }

  const fetchContractWithTask = async (contractId: string) => {
    return await api.get<ContractWithTask>(`contracts/${contractId}`)
  }

  const addMilestones = async (contractId: string, data: ContractMilestoneToAddRequest) => {
    return await api.post<ContractPublicInfo>(`contracts/${contractId}/milestones`, data)
  }

  const deleteMilestone = async (contractId: string, milestoneId: string) => {
    return await api.delete<Record<string, never>>(`contracts/${contractId}/milestones/${milestoneId}`)
  }

  const secureMilestoneMoney = async (contractId: string, milestoneId: string) => {
    return await api.post<ContractPublicInfo>(`contracts/${contractId}/milestones/${milestoneId}/secure`)
  }

  const releaseMilestoneMoney = async (contractId: string, milestoneId: string) => {
    return await api.post<ContractPublicInfo>(`contracts/${contractId}/milestones/${milestoneId}/release`)
  }

  return {
    addContract,
    acceptContract,
    endContract,
    deleteContract,
    fetchInfluencerContracts,
    fetchMarketerContracts,
    fetchContractsForTask,
    fetchContractWithTask,
    addMilestones,
    deleteMilestone,
    secureMilestoneMoney,
    releaseMilestoneMoney,
  }
}
