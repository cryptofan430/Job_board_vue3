import { computed, watch } from 'vue'
import { clearPaginationPayload, createPageLimitsWatcher, fetchEntitiesFactory } from '@/components/helpers/api'
import { scrollToPageTop } from '@/components/helpers/dom'
import { extractEntitiesLoadingState } from '@/components/helpers/state'
import {
  AdminJoinTicketChatError,
  AdminTicketsFilters,
  AdminTicketsPagination,
  AdminTicketUiInfo,
  TicketCloseByAdminError,
  TicketState,
} from '@/types/tickets'
import useTicketsParams from '@/components/marketer/admin/tickets/admin-tickets-params'
import useTicketsController from '@/middleware/controllers/useTicketsController'
import useAdminTicketsStore from '@/store/admin-tickets'
import { getFirstError } from '@/services/api'
import useToastsStore from '@/store/toasts'
import { AxiosError } from 'axios'
import { useRouter } from 'vue-router'

export default function useAdminTickets() {
  const router = useRouter()
  const {
    getAdminTickets,
    getAdminTicketCount,
    adminTicketsState,
    ticketsCache,
    setAdminTickets,
    setAdminTicketsCount,
    setAdminTicketsState,
    getFirstTicket,
    getLastTicket,
  } = useAdminTicketsStore()
  const { paginationPayload, ticketPerPage, ticketsPagination, ticketsFilters, updateQueryParams } = useTicketsParams()
  const { addToast } = useToastsStore()
  const { fetchAdminTickets, adminCloseTicket, adminJoinChat } = useTicketsController()

  const activePage = computed(() => ticketsPagination.skip / ticketsPagination.limit + 1)
  const { isLoaded, isLoading, isError } = extractEntitiesLoadingState(adminTicketsState)

  const _fetchTickets = async (params: AdminTicketsPagination) => {
    const {
      updatedParams,
      currentPageEntities: cachedEntities,
      extractCurrentEntities,
      calcEntitiesCount,
    } = fetchEntitiesFactory(params, ticketsCache)

    if (cachedEntities) {
      setAdminTickets(cachedEntities)
    }

    if (extractCurrentEntities) {
      return await fetchAdminTickets(updatedParams as AdminTicketsFilters).then((response) => {
        const { currentPageEntities } = extractCurrentEntities(response.data.tickets)

        if (calcEntitiesCount) setAdminTicketsCount(calcEntitiesCount(response.data.count))
        if (!cachedEntities) setAdminTickets(currentPageEntities)
      })
    }
  }

  const closeTicket = (ticket: AdminTicketUiInfo) => {
    ticket.closeInProgress = true
    adminCloseTicket(ticket.id)
      .then((response) => {
        ticket.state = response.data.state
        addToast('Ticket has been successfully closed', 'success')
      })
      .catch((e: AxiosError) => {
        const error = getFirstError<TicketCloseByAdminError>(e)
        if (error?.errorType === TicketCloseByAdminError.TICKET_ALREADY_CLOSED) {
          addToast('Ticket is already closed', 'danger')
          ticket.state = TicketState.CLOSED
        } else if (error?.errorType === TicketCloseByAdminError.TICKET_NOT_EXIST) {
          addToast("Ticket you're trying to close does not exist", 'danger')
        } else {
          addToast(
            'Unexpected error occurred when closing ticket, please check your internet connection and try again',
            'danger'
          )
        }
      })
      .finally(() => {
        ticket.closeInProgress = false
      })
  }

  const updatePage = (targetPage: number) => {
    scrollToPageTop()
    const firstTicket = getFirstTicket()
    const lastTicket = getLastTicket()

    paginationPayload.currentPage = activePage.value
    paginationPayload.newerThanId = firstTicket?.id
    paginationPayload.olderThanId = lastTicket?.id

    updateQueryParams({ page: targetPage })
  }

  const fetchTicketsWithNewParams = () => {
    _fetchTickets({
      ...ticketsFilters,
      ...paginationPayload,
      ...ticketsPagination,
      targetPage: activePage.value,
    })
      .then(() => setAdminTicketsState('loaded'))
      .catch((e) => setAdminTicketsState('error', { message: e?.message }))

    clearPaginationPayload(paginationPayload)
  }

  const refetchTickets = () => {
    setAdminTicketsState('loading')
    fetchTicketsWithNewParams()
  }

  const joinTicketChat = (ticket: AdminTicketUiInfo) => {
    ticket.joinInProgress = true
    if (ticket.joinedChat && ticket.chatId) {
      router.push({
        name: 'SelectedChat',
        params: {
          chatId: ticket.chatId,
        },
      })
    } else {
      adminJoinChat(ticket.id)
        .then((response) => {
          router.push({
            name: 'SelectedChat',
            params: {
              chatId: response.data.id,
            },
          })
        })
        .catch((e: AxiosError) => {
          const error = getFirstError<AdminJoinTicketChatError>(e)
          if (error?.errorType === AdminJoinTicketChatError.TICKET_NOT_EXIST) {
            addToast("Ticket you're trying to join does not exist", 'danger')
          } else if (error?.errorType === AdminJoinTicketChatError.TICKET_ALREADY_CLOSED) {
            addToast("Ticket you're trying to join is already closed", 'danger')
          } else {
            addToast(
              'Unexpected error occurred when closing ticket, please check your internet connection and try again',
              'danger'
            )
          }
        })
    }
  }

  const updateFilters = (filters: Record<string, unknown>) => {
    ticketsCache.clear()
    updateQueryParams({
      ...filters,
      page: 1,
    })
  }

  const watchPageLimits = createPageLimitsWatcher(getAdminTickets, getAdminTicketCount, activePage, updatePage)
  const watchFilters = () => {
    watch(ticketsPagination, fetchTicketsWithNewParams)
  }

  return {
    ticketsFilters,
    getAdminTickets,
    getAdminTicketCount,
    adminTicketsState,
    ticketPerPage,
    isLoaded,
    isError,
    isLoading,
    activePage,
    refetchTickets,
    watchPageLimits,
    watchFilters,
    updatePage,
    closeTicket,
    joinTicketChat,
    updateQueryParams,
    updateFilters,
  }
}
