import { computed, reactive, ref } from 'vue'
import { useNumericUrlParamReactive, useUpdateQueryParams } from '@/components/helpers/route'
import { BasicPagination, PaginationPayload } from '@/types/api.model'
import { createPaginationPayload } from '@/components/helpers/api'

const paginationPayloadRef = ref<PaginationPayload>()

const useInfluencerInvitationParams = () => {
  const pageNumber = useNumericUrlParamReactive('page')
  const validPageNumber = computed(() => Math.max(1, pageNumber.value || 1))

  const influencerInvitationsPerPage = 10

  const influencerInvitationsPagination: BasicPagination = reactive({
    limit: influencerInvitationsPerPage,
    skip: computed(() => (validPageNumber.value - 1) * influencerInvitationsPerPage),
  })

  const paginationPayload = paginationPayloadRef.value || createPaginationPayload()
  paginationPayloadRef.value = paginationPayload

  return {
    influencerInvitationsPagination,
    influencerInvitationsPerPage,
    paginationPayload,
  }
}

export default function useInfluencerInvitationsFilters() {
  const { influencerInvitationsPagination, influencerInvitationsPerPage, paginationPayload } =
    useInfluencerInvitationParams()

  const updateRouteParams = useUpdateQueryParams()

  return {
    influencerInvitationsPagination,
    influencerInvitationsPerPage,
    paginationPayload,
    updateRouteParams,
  }
}
