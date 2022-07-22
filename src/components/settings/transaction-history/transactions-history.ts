import { computed, watch } from 'vue'
import { AxiosError } from 'axios'
import { clearPaginationPayload, createPageLimitsWatcher, fetchEntitiesFactory } from '@/components/helpers/api'
import { extractEntitiesLoadingState } from '@/components/helpers/state'
import { errorMessagesToString } from '@/services/api'
import useTransactionsController from '@/middleware/controllers/useTransactionsController'
import { PaginationWithPage } from '@/types/api.model'
import { SimpleAccessFile } from '@/types/file.model'
import useTransactionsHistoryStore from '@/store/settings-transactions-history'
import useToastsStore from '@/store/toasts'
import useTransactionsFilters from './transactions-history-params'

export default function useTransactionsHistory() {
  const { fetchTransactions, fetchTransactionDownloadFiles } = useTransactionsController()
  const {
    getTransactions,
    getTransactionsLoadingState,
    transactionsCache,
    getTransactionsCount,
    setTransactions,
    setTransactionsCount,
    setNewTransactionsState,
    getFirstTransaction,
    getLastTransaction,
  } = useTransactionsHistoryStore()
  const { transactionsPagination, paginationPayload, transactionsPerPage, updateRouteParams } = useTransactionsFilters()
  const { addToast } = useToastsStore()

  const activePage = computed(() => transactionsPagination.skip / transactionsPagination.limit + 1)
  const { isLoading, isLoaded, isError } = extractEntitiesLoadingState(getTransactionsLoadingState.value)

  const _fetchTransactions = async (params: PaginationWithPage) => {
    const {
      updatedParams,
      currentPageEntities: cachedProposals,
      extractCurrentEntities,
      calcEntitiesCount,
    } = fetchEntitiesFactory(params, transactionsCache)

    if (cachedProposals) {
      setTransactions(cachedProposals)
    }

    if (extractCurrentEntities) {
      return await fetchTransactions(updatedParams).then((response) => {
        const { currentPageEntities } = extractCurrentEntities(response.data.transactions)

        if (calcEntitiesCount) setTransactionsCount(calcEntitiesCount(response.data.count))
        if (!cachedProposals) setTransactions(currentPageEntities)
      })
    }
  }

  const updatePage = (targetPage: number) => {
    const firstTransaction = getFirstTransaction()
    const lastTransaction = getLastTransaction()

    paginationPayload.currentPage = activePage.value
    paginationPayload.newerThanId = firstTransaction?.id
    paginationPayload.olderThanId = lastTransaction?.id

    updateRouteParams({ page: targetPage })
  }

  const fetchTransactionsFirstPage = () => {
    const cachedTransactions = transactionsCache.get(1)

    if (cachedTransactions) setTransactions(cachedTransactions)
    if (!cachedTransactions) setNewTransactionsState('loading')

    _fetchTransactions({
      skip: 0,
      limit: transactionsPerPage,
      targetPage: 1,
    })
      .then(() => setNewTransactionsState('loaded'))
      .catch((e) => setNewTransactionsState('error', { message: e?.message }))
  }

  const fetchTransactionsInitial = () => {
    _fetchTransactions({
      ...transactionsPagination,
      ...paginationPayload,
      targetPage: activePage.value,
    })
      .then(() => setNewTransactionsState('loaded'))
      .catch((e) => {
        setNewTransactionsState('error', { message: e?.message })
      })

    clearPaginationPayload(paginationPayload)
  }

  const refetchTransactions = () => {
    setNewTransactionsState('loading')

    fetchTransactionsInitial()
  }

  const watchPageLimits = createPageLimitsWatcher(getTransactions, getTransactionsCount, activePage, updatePage)

  const watchFilters = () => {
    watch(transactionsPagination, fetchTransactionsInitial)
  }

  const downloadFile = (file: SimpleAccessFile, fileName?: string) => {
    const link = document.createElement('a')
    link.setAttribute('download', fileName || file.filename)
    link.setAttribute('href', file.signedUrl)

    link.click()
  }

  const downloadInvoices = async () => {
    fetchTransactionDownloadFiles({ state: 'MARKETER' })
      .then((response) => {
        downloadFile(response.data, 'FreelanceInfluencer.MarketerInvoices.zip')
      })
      .catch((e: AxiosError) => {
        const error = errorMessagesToString(e)
        addToast(error, 'danger')
      })

    fetchTransactionDownloadFiles({ state: 'INFLUENCER' })
      .then((response) => {
        downloadFile(response.data, 'FreelanceInfluencer.InfluencerInvoices.zip')
      })
      .catch((e: AxiosError) => {
        const error = errorMessagesToString(e)
        addToast(error, 'danger')
      })
  }

  return {
    getTransactions,
    getTransactionsCount,
    isLoading,
    isLoaded,
    isError,
    activePage,
    transactionsPerPage,
    watchFilters,
    fetchTransactionsFirstPage,
    fetchTransactionsInitial,
    downloadInvoices,
    refetchTransactions,
    watchPageLimits,
    updatePage,
  }
}
