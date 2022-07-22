import { computed, reactive } from 'vue'
import { createPaginationPayload } from '@/components/helpers/api'
import {
  useBooleanQueryParamReactive,
  useNumericUrlParamReactive,
  useStringUrlParamReactive,
  useUpdateQueryParams,
} from '@/components/helpers/route'
import { BasicPagination } from '@/types/api.model'
import { AdminDisputeFilters, DisputeState } from '@/types/disputes'

const paginationPayload = createPaginationPayload()
const useAdminStateParam = () => {
  const ticketsState = useStringUrlParamReactive('state')
  const validStates = new Set<string | undefined>(Object.values(DisputeState))

  return computed(() => (validStates.has(ticketsState.value) ? (ticketsState.value as DisputeState) : undefined))
}

export default function useDisputesParams() {
  const pageNumber = useNumericUrlParamReactive('page')
  const validPageNumber = computed(() => Math.max(1, pageNumber.value || 1))
  const disputePerPage = 10

  const disputesPagination: BasicPagination = reactive({
    limit: disputePerPage,
    skip: computed(() => (validPageNumber.value - 1) * disputePerPage),
  })

  const disputesFilters: AdminDisputeFilters = reactive({
    state: useAdminStateParam(),
    isAdminInChat: useBooleanQueryParamReactive('isAdminInChat'),
    haveIJoined: useBooleanQueryParamReactive('haveIJoined'),
  })

  const updateQueryParams = useUpdateQueryParams()

  return {
    disputesPagination,
    disputePerPage,
    paginationPayload,
    disputesFilters,
    updateQueryParams,
  }
}
