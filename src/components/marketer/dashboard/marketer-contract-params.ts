import { computed, reactive, ref } from 'vue'
import { useNumericUrlParamReactive, useUpdateQueryParams } from '@/components/helpers/route'
import { BasicPagination, PaginationPayload } from '@/types/api.model'
import { createPaginationPayload } from '@/components/helpers/api'

const paginationPayloadRef = ref<PaginationPayload>()

const useMarketerAllContractParams = () => {
  const pageNumber = useNumericUrlParamReactive('page')
  const validPageNumber = computed(() => Math.max(1, pageNumber.value || 1))

  const marketerContractsPerPage = 10

  const marketerContractsPagination: BasicPagination = reactive({
    limit: marketerContractsPerPage,
    skip: computed(() => (validPageNumber.value - 1) * marketerContractsPerPage),
    newerThanId: undefined,
    olderThanId: undefined,
  })

  const paginationPayload = paginationPayloadRef.value || createPaginationPayload()
  paginationPayloadRef.value = paginationPayload

  return {
    marketerContractsPagination,
    marketerContractsPerPage,
    paginationPayload,
  }
}

export default function useMarketerAllContractsFilters() {
  const { marketerContractsPagination, marketerContractsPerPage, paginationPayload } = useMarketerAllContractParams()

  const updateRouteParams = useUpdateQueryParams()

  return {
    marketerContractsPagination,
    marketerContractsPerPage,
    paginationPayload,
    updateRouteParams,
  }
}
