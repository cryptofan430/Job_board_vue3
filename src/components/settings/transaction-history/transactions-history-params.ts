import { createPaginationPayload } from '@/components/helpers/api'
import { useNumericUrlParamReactive, useUpdateQueryParams } from '@/components/helpers/route'
import { PaginationPayload, PaginationWithPage } from '@/types/api.model'
import { computed, reactive, ref } from 'vue'

const transactionPaginationPayloadRef = ref<PaginationPayload>()

const useTransactionsParams = () => {
  const pageNumber = useNumericUrlParamReactive('page')
  const validPageNumber = computed(() => Math.max(1, pageNumber.value || 1))

  const transactionsPerPage = 10

  const transactionsPagination: PaginationWithPage = reactive({
    limit: transactionsPerPage,
    skip: computed(() => (validPageNumber.value - 1) * transactionsPerPage),
  })

  const paginationPayload = transactionPaginationPayloadRef.value || createPaginationPayload()
  transactionPaginationPayloadRef.value = paginationPayload

  return {
    paginationPayload,
    transactionsPagination,
    transactionsPerPage,
  }
}

export default function useTransactionsFilters() {
  const { transactionsPagination, transactionsPerPage, paginationPayload } = useTransactionsParams()

  const updateRouteParams = useUpdateQueryParams()

  return {
    transactionsPagination,
    transactionsPerPage,
    paginationPayload,
    updateRouteParams,
  }
}
