import { computed, reactive } from 'vue'
import { createPaginationPayload } from '@/components/helpers/api'
import { useNumericUrlParamReactive, useUpdateQueryParams } from '@/components/helpers/route'
import { BasicPagination } from '@/types/api.model'

const paginationPayload = createPaginationPayload()

export default function useInfluencerDisputesParams() {
  const pageNumber = useNumericUrlParamReactive('page')
  const validPageNumber = computed(() => Math.max(1, pageNumber.value || 1))
  const disputesPerPage = 6

  const disputesPagination: BasicPagination = reactive({
    limit: disputesPerPage,
    skip: computed(() => (validPageNumber.value - 1) * disputesPerPage),
  })

  const updateQueryParams = useUpdateQueryParams()

  return {
    disputesPagination,
    disputesPerPage,
    paginationPayload,
    updateQueryParams,
  }
}
