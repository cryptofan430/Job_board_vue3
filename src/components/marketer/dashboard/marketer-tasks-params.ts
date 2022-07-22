import { computed, reactive, ref } from 'vue'
import { useNumericUrlParamReactive, useUpdateQueryParams } from '@/components/helpers/route'
import { TaskPagination } from '@/types/tasks.model'
import { PaginationPayload } from '@/types/api.model'
import { createPaginationPayload } from '@/components/helpers/api'

const paginationPayloadRef = ref<PaginationPayload>()

const useMarketerTaskParams = () => {
  const pageNumber = useNumericUrlParamReactive('page')
  const validPageNumber = computed(() => Math.max(1, pageNumber.value || 1))

  const marketerTasksPerPage = 10

  const tasksPagination: TaskPagination = reactive({
    limit: marketerTasksPerPage,
    skip: computed(() => (validPageNumber.value - 1) * marketerTasksPerPage),
    newerThanId: undefined,
    olderThanId: undefined,
  })

  const paginationPayload = paginationPayloadRef.value || createPaginationPayload()
  paginationPayloadRef.value = paginationPayload

  return {
    marketerTasksPerPage,
    tasksPagination,
    paginationPayload,
  }
}

export default function useMarketerTaskFilters() {
  const { tasksPagination, marketerTasksPerPage, paginationPayload } = useMarketerTaskParams()

  const updateRouteParams = useUpdateQueryParams()

  return {
    paginationPayload,
    marketerTasksPerPage,
    tasksPagination,
    updateRouteParams,
  }
}
