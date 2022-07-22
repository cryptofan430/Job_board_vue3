import { ApiLoadingState, EntitiesLoadingState } from '@/types/api.model'
import { TransactionPublicInfo } from '@/types/transaction.model'
import { computed, reactive, readonly, ref } from 'vue'

const transactionsCache = new Map<number, Array<TransactionPublicInfo>>([])
const transactions = ref<Array<TransactionPublicInfo>>([])
const transactionsCount = ref<number>(0)
const transactionsLoadingState = reactive<EntitiesLoadingState>({
  state: 'loading',
  payload: {
    message: undefined,
  },
})

const reset = () => {
  transactionsCache.clear()
  transactions.value = []
  transactionsCount.value = 0
  transactionsLoadingState.state = 'loading'
  transactionsLoadingState.payload = { message: undefined }
}

export default function useTransactionsHistoryStore() {
  const getTransactions = computed(() => transactions.value)
  const getTransactionsCount = readonly(transactionsCount)
  const getTransactionsLoadingState = computed(() => transactionsLoadingState)

  const setTransactions = (newTransactions: Array<TransactionPublicInfo>) => {
    transactions.value = newTransactions
  }
  const getFirstTransaction = () => getTransactions.value[0] || null
  const getLastTransaction = () => getTransactions.value[getTransactions.value.length - 1] || null
  const setTransactionsCount = (newTasksCount: number) => (transactionsCount.value = newTasksCount)

  const setNewTransactionsState = (state: ApiLoadingState, payload?: { message?: string }) => {
    transactionsLoadingState.state = state
    transactionsLoadingState.payload = payload
  }

  return {
    getTransactions,
    getTransactionsCount,
    getTransactionsLoadingState,
    transactionsCache,
    reset,
    setTransactions,
    setTransactionsCount,
    getFirstTransaction,
    getLastTransaction,
    setNewTransactionsState,
  }
}
