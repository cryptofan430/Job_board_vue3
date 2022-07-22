import { computed, reactive, ref } from 'vue'
import { useUpdateQueryParams, useNumericUrlParamReactive, useArrayUrlParamReactive } from '@/components/helpers/route'
import { TaskSocialMediaPlatform } from '@/types/platform.model'
import { TaskFilters } from '@/types/tasks.model'
import { BasicPagination, PaginationPayload } from '@/types/api.model'
import { createPaginationPayload } from '@/components/helpers/api'

const tasksPaginationPayloadRef = ref<PaginationPayload>()

const usePlatformsUrlParam = () => {
  const platforms = useArrayUrlParamReactive('platforms')

  return computed(() => {
    const socialMediaPlatforms = Object.values(TaskSocialMediaPlatform)
    const validPlatforms =
      platforms.value?.filter((value) => socialMediaPlatforms.includes(value as TaskSocialMediaPlatform)) || []
    return validPlatforms as Array<TaskSocialMediaPlatform>
  })
}

const useTaskParams = () => {
  const pageNumber = useNumericUrlParamReactive('page')
  const validPageNumber = computed(() => Math.max(1, pageNumber.value || 1))

  const tasksKeywords = useArrayUrlParamReactive('keywords')
  const tasksSearch = reactive({
    keywords: tasksKeywords,
  })
  const tasksPerPage = 10

  const tasksPagination: BasicPagination = reactive({
    limit: tasksPerPage,
    skip: computed(() => (validPageNumber.value - 1) * tasksPerPage),
  })

  const tasksFilters: TaskFilters = reactive({
    budgetGreaterEqual: useNumericUrlParamReactive('budgetGreaterEqual'),
    budgetLowerEqual: useNumericUrlParamReactive('budgetLowerEqual'),
    platforms: usePlatformsUrlParam(),
  })

  const paginationPayload = tasksPaginationPayloadRef.value || createPaginationPayload()

  tasksPaginationPayloadRef.value = paginationPayload

  return {
    tasksFilters,
    tasksPerPage,
    tasksPagination,
    tasksSearch,
    paginationPayload,
  }
}

export default function useTaskFilters() {
  const { tasksFilters, tasksPagination, tasksSearch, paginationPayload, tasksPerPage } = useTaskParams()

  const updateRouteParams = useUpdateQueryParams()

  return {
    tasksFilters,
    tasksSearch,
    tasksPagination,
    paginationPayload,
    tasksPerPage,
    updateRouteParams,
  }
}
