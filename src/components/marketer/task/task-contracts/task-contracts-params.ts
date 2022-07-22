import { computed, reactive, ref } from 'vue'
import { useNumericUrlParamReactive, useUpdateQueryParams } from '@/components/helpers/route'
import { BasicPagination, PaginationPayload } from '@/types/api.model'
import { useRoute } from 'vue-router'
import { createPaginationPayload } from '@/components/helpers/api'

const tasksPaginationPayloadRef = ref<PaginationPayload>()

const useMarketerContractParams = () => {
  const pageNumber = useNumericUrlParamReactive('page')
  const validPageNumber = computed(() => Math.max(1, pageNumber.value || 1))

  const taskId = useRoute().params.taskId?.toString() || ''

  const marketerContractsPerPage = 10

  const marketerContractsPagination: BasicPagination = reactive({
    limit: marketerContractsPerPage,
    skip: computed(() => (validPageNumber.value - 1) * marketerContractsPerPage),
  })

  const paginationPayload = tasksPaginationPayloadRef.value || createPaginationPayload()
  tasksPaginationPayloadRef.value = paginationPayload

  return {
    marketerContractsPagination,
    marketerContractsPerPage,
    paginationPayload,
    taskId,
  }
}

export default function useMarketerContractsFilters() {
  const { marketerContractsPagination, marketerContractsPerPage, paginationPayload, taskId } =
    useMarketerContractParams()

  const updateRouteParams = useUpdateQueryParams()

  return {
    paginationPayload,
    marketerContractsPagination,
    marketerContractsPerPage,
    taskId,
    updateRouteParams,
  }
}
