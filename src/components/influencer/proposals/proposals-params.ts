import { computed, reactive, ref } from 'vue'
import { useNumericUrlParamReactive, useUpdateQueryParams } from '@/components/helpers/route'
import { BasicPagination, PaginationPayload } from '@/types/api.model'
import { createPaginationPayload } from '@/components/helpers/api'

const paginationPayloadRef = ref<PaginationPayload>()

const useInfluencerProposalParams = () => {
  const pageNumber = useNumericUrlParamReactive('page')
  const validPageNumber = computed(() => Math.max(1, pageNumber.value || 1))
  const influencerProposalsPerPage = 10

  const influencerProposalsPagination: BasicPagination = reactive({
    limit: influencerProposalsPerPage,
    skip: computed(() => (validPageNumber.value - 1) * influencerProposalsPerPage),
  })

  const paginationPayload = paginationPayloadRef.value || createPaginationPayload()
  paginationPayloadRef.value = paginationPayload

  return {
    influencerProposalsPagination,
    influencerProposalsPerPage,
    paginationPayload,
  }
}

export default function useInfluencerProposalsFilters() {
  const { influencerProposalsPagination, influencerProposalsPerPage, paginationPayload } = useInfluencerProposalParams()

  const updateRouteParams = useUpdateQueryParams()

  return {
    influencerProposalsPagination,
    influencerProposalsPerPage,
    paginationPayload,
    updateRouteParams,
  }
}
