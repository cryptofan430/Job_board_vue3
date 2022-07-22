import { Currency, CurrencyValue } from '@/types/money.model'
import { EntitiesLoadingState, PaginationWithPage } from './api.model'
import { TaskSocialMediaPlatform } from '@/types/platform.model'
import { SimpleAccessFile } from './file.model'
import { UserStatePublicInfo } from './user.model'

export interface TaskUpdateData {
  title: string
  description: string
  budget: {
    value: string
    currency: Currency
  }
  id: string
}

export interface TaskToUpdate {
  id: string
  title?: string
  description?: string
  budget?: number
  platforms?: Array<TaskSocialMediaPlatform>
  filesIds?: Array<string>
}

export interface TaskForUpdateForm {
  id: string
  title?: string
  description?: string
  budget?: string
  platforms?: Array<TaskSocialMediaPlatform>
}

export interface TaskCreateData {
  title: string
  description: string
  budget: {
    value: string
    currency: Currency
  }
  platforms: Array<TaskSocialMediaPlatform>
}

export interface TaskToCreate {
  title: string
  description: string
  budget: CurrencyValue
  platforms: Array<TaskSocialMediaPlatform>
  filesIds: Array<string>
}

export type TasksQueryParams = TaskFilters & TaskSearch & TaskPagination

export interface TaskFilters {
  platforms?: Array<TaskSocialMediaPlatform>
  budgetGreaterEqual?: number
  budgetLowerEqual?: number
}

export interface TaskSearch {
  keywords?: Array<string>
}

export type TaskPagination = PaginationWithPage

export interface MyTasksQueryParams {
  limit: number
  olderThanId?: string
  newerThanId?: string
  skip?: number
}

export interface TaskPublicInfo {
  id: string
  addedTime: string
  title: string
  description: string
  budget: CurrencyValue
  proposalCount: number
  platforms: Array<TaskSocialMediaPlatform>
  proposalAlreadySent: boolean
  addedByMe: boolean
  hasContractCreated: boolean
  hasContractAccepted: boolean
  files: Array<SimpleAccessFile>
  marketerInfo: UserStatePublicInfo
}

export interface TasksResponse {
  tasks: Array<TaskPublicInfo>
  count: number
}

export type TasksLoadingState = EntitiesLoadingState
