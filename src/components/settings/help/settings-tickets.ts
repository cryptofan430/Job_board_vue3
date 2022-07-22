import { clearPaginationPayload, fetchEntitiesFactory } from '@/components/helpers/api'
import { extractEntitiesLoadingState } from '@/components/helpers/state'
import useTicketsController from '@/middleware/controllers/useTicketsController'
import { getFirstError } from '@/services/api'
import useSettingsTicketsStore from '@/store/settings-tickets'
import useToastsStore from '@/store/toasts'
import { PaginationWithPage } from '@/types/api.model'
import { TicketCloseError, TicketState, TicketUiPublicInfo } from '@/types/tickets'
import { AxiosError } from 'axios'
import { computed } from 'vue'
import useSettingsTicketsCreate from './settings-ticket-create'
import useTicketsParams from './tickets-params'

export default function useSettingsTickets() {
  const { isCreatingTicket, ticketForm, submitForm } = useSettingsTicketsCreate()
  const { ticketPerPage, ticketsPagination, paginationPayload } = useTicketsParams()
  const { fetchMyTickets, closeMyTicket } = useTicketsController()
  const { addToast } = useToastsStore()
  const {
    getSettingsTicketCount,
    getSettingsTickets,
    settingsTicketsCache,
    ticketsLoadingState,
    addNewTicket,
    setSettingsTickets,
    setSettingsTicketsCount,
    setSettingsTicketsState,
  } = useSettingsTicketsStore()

  const activePage = computed(() => ticketsPagination.skip / ticketsPagination.limit + 1)
  const { isLoaded, isLoading, isError } = extractEntitiesLoadingState(ticketsLoadingState)

  const _fetchTickets = async (params: PaginationWithPage) => {
    const {
      updatedParams,
      currentPageEntities: cachedEntities,
      extractCurrentEntities,
      calcEntitiesCount,
    } = fetchEntitiesFactory(params, settingsTicketsCache)

    if (cachedEntities) {
      setSettingsTickets(cachedEntities)
    }

    if (extractCurrentEntities) {
      return await fetchMyTickets(updatedParams).then((response) => {
        const { currentPageEntities } = extractCurrentEntities(response.data.tickets)

        if (calcEntitiesCount) setSettingsTicketsCount(calcEntitiesCount(response.data.count))
        if (!cachedEntities) setSettingsTickets(currentPageEntities)
      })
    }
  }

  const fetchTicketsInitial = () => {
    _fetchTickets({
      ...ticketsPagination,
      ...paginationPayload,
      limit: 2 ** 28,
      targetPage: activePage.value,
    })
      .then(() => setSettingsTicketsState('loaded'))
      .catch((e) => setSettingsTicketsState('error', { message: e?.message }))

    clearPaginationPayload(paginationPayload)
  }

  const refetchTickets = () => {
    if (isError.value || !getSettingsTickets.value.length) {
      setSettingsTicketsState('loading')
    }
    fetchTicketsInitial()
  }

  const closeTicket = (ticket: TicketUiPublicInfo) => {
    ticket.closeInProgress = true
    closeMyTicket(ticket.id)
      .then((response) => {
        ticket.state = response.data.state
        addToast('Ticket has been successfully closed', 'success')
      })
      .catch((e: AxiosError) => {
        const error = getFirstError<TicketCloseError>(e)
        if (error?.errorType === TicketCloseError.TICKET_ALREADY_CLOSED) {
          addToast('Ticket is already closed', 'danger')
          ticket.state = TicketState.CLOSED
        } else if (error?.errorType === TicketCloseError.TICKET_NOT_BELONG_TO_USER) {
          addToast("Ticket you're trying to close does not belong to you", 'danger')
        } else if (error?.errorType === TicketCloseError.TICKET_NOT_EXIST) {
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

  const submitTicketForm = () => {
    submitForm().then((response) => {
      if (!response) return
      addNewTicket(response.data)
    })
  }

  return {
    getSettingsTicketCount,
    getSettingsTickets,
    ticketPerPage,
    isCreatingTicket,
    ticketForm,
    isLoaded,
    isLoading,
    isError,
    submitTicketForm,
    refetchTickets,
    closeTicket,
  }
}
