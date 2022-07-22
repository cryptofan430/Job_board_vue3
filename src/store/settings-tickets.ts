import { ApiLoadingState, EntitiesLoadingState } from '@/types/api.model'
import { TicketPublicInfo } from '@/types/tickets'
import { computed, reactive, readonly, ref } from 'vue'

const settingsTicketsCache = new Map<number, Array<TicketPublicInfo>>()
const settingsTickets = ref<Array<TicketPublicInfo>>([])
const settingsTicketCount = ref(0)
const ticketsLoadingState = reactive<EntitiesLoadingState>({
  state: 'loaded',
  payload: {
    message: undefined,
  },
})

const getFirstTicket = () => settingsTickets.value[0]
const getLastTicket = () => settingsTickets.value[settingsTickets.value.length - 1]

const addNewTicket = (ticket: TicketPublicInfo) => {
  settingsTickets.value.unshift(ticket)
}

const setSettingsTickets = (tickets: Array<TicketPublicInfo>) => {
  settingsTickets.value = tickets
}

const setSettingsTicketsCount = (count: number) => {
  settingsTicketCount.value = count
}

const setSettingsTicketsState = (state: ApiLoadingState, payload?: { message?: string }) => {
  ticketsLoadingState.state = state
  ticketsLoadingState.payload = payload
}

const reset = () => {
  settingsTickets.value = []
  settingsTicketCount.value = 0
  ticketsLoadingState.state = 'loaded'
  ticketsLoadingState.payload = { message: undefined }
  settingsTicketsCache.clear()
}

export default function useSettingsTicketsStore() {
  const getSettingsTickets = computed(() => settingsTickets.value)
  const getSettingsTicketCount = readonly(settingsTicketCount)

  return {
    getSettingsTickets,
    getSettingsTicketCount,
    ticketsLoadingState,
    settingsTicketsCache,
    getFirstTicket,
    getLastTicket,
    addNewTicket,
    setSettingsTickets,
    setSettingsTicketsCount,
    setSettingsTicketsState,
    reset,
  }
}
