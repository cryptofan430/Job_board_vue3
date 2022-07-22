import { computed, reactive } from 'vue'
import { createPaginationPayload } from '@/components/helpers/api'
import { useNumericUrlParamReactive, useUpdateQueryParams } from '@/components/helpers/route'
import { BasicPagination } from '@/types/api.model'

const paginationPayload = createPaginationPayload()

export default function useTicketsParams() {
  const pageNumber = useNumericUrlParamReactive('page')
  const validPageNumber = computed(() => Math.max(1, pageNumber.value || 1))
  const ticketPerPage = 6

  const ticketsPagination: BasicPagination = reactive({
    limit: ticketPerPage,
    skip: computed(() => (validPageNumber.value - 1) * ticketPerPage),
  })

  const updateQueryParams = useUpdateQueryParams()

  return {
    ticketsPagination,
    ticketPerPage,
    paginationPayload,
    updateQueryParams,
  }
}
