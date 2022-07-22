import { computed, reactive } from 'vue'
import { createPaginationPayload } from '@/components/helpers/api'
import {
  useBooleanQueryParamReactive,
  useNumericUrlParamReactive,
  useStringUrlParamReactive,
  useUpdateQueryParams,
} from '@/components/helpers/route'
import { BasicPagination } from '@/types/api.model'
import { AdminTicketsFilters, TicketState } from '@/types/tickets'

const paginationPayload = createPaginationPayload()

const useAdminStateParam = () => {
  const ticketsState = useStringUrlParamReactive('state')
  const validStates = new Set<string | undefined>(Object.values(TicketState))

  return computed(() => (validStates.has(ticketsState.value) ? (ticketsState.value as TicketState) : undefined))
}

export default function useTicketsParams() {
  const pageNumber = useNumericUrlParamReactive('page')
  const validPageNumber = computed(() => Math.max(1, pageNumber.value || 1))
  const ticketPerPage = 10

  const ticketsPagination: BasicPagination = reactive({
    limit: ticketPerPage,
    skip: computed(() => (validPageNumber.value - 1) * ticketPerPage),
  })

  const ticketsFilters: AdminTicketsFilters = reactive({
    state: useAdminStateParam(),
    isAdminInChat: useBooleanQueryParamReactive('isAdminInChat'),
    haveIJoined: useBooleanQueryParamReactive('haveIJoined'),
  })

  const updateQueryParams = useUpdateQueryParams()

  return {
    ticketsPagination,
    ticketPerPage,
    paginationPayload,
    ticketsFilters,
    updateQueryParams,
  }
}
