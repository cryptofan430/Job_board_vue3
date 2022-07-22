import { computed, reactive, readonly, ref } from 'vue'
import { TicketAdminInfo } from '@/types/tickets'
import { ApiLoadingState, EntitiesLoadingState } from '@/types/api.model'

const ticketsCache = new Map<number, Array<TicketAdminInfo>>()
const adminTickets = ref<Array<TicketAdminInfo>>([])
const adminTicketsCount = ref(0)
const adminTicketsState = reactive<EntitiesLoadingState>({
  state: 'loading',
  payload: {
    message: undefined,
  },
})

const getFirstTicket = () => adminTickets.value[0]
const getLastTicket = () => adminTickets.value[adminTickets.value.length - 1]

const setAdminTickets = (tickets: Array<TicketAdminInfo>) => {
  adminTickets.value = tickets
}

const setAdminTicketsCount = (count: number) => {
  adminTicketsCount.value = count
}

const setAdminTicketsState = (state: ApiLoadingState, payload?: { message?: string }) => {
  adminTicketsState.state = state
  adminTicketsState.payload = payload
}

const reset = () => {
  adminTickets.value = []
  adminTicketsCount.value = 0
  adminTicketsState.state = 'loaded'
  adminTicketsState.payload = { message: undefined }
  ticketsCache.clear()
}

export default function useAdminTicketsStore() {
  const getAdminTickets = computed(() => adminTickets.value)
  const getAdminTicketCount = readonly(adminTicketsCount)

  return {
    getAdminTickets,
    getAdminTicketCount,
    adminTicketsState,
    ticketsCache,
    getFirstTicket,
    getLastTicket,
    setAdminTickets,
    setAdminTicketsCount,
    setAdminTicketsState,
    reset,
  }
}
