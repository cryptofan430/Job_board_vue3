import api, { paramsToQueryString } from '@/services/api'
import { BasicPagination } from '@/types/api.model'
import { SimpleAccessFile } from '@/types/file.model'
import { CurrencyValue } from '@/types/money.model'
import {
  StripePaymentIntentPublicInfo,
  TransactionDownloadFilesParams,
  TransactionsResponse,
} from '@/types/transaction.model'

const fetchTransactions = (params?: BasicPagination) => {
  return api.get<TransactionsResponse>(`/transactions/my/${paramsToQueryString(params)}`)
}

const fetchTransactionDownloadFiles = (params: TransactionDownloadFilesParams) => {
  return api.get<SimpleAccessFile>(`/transactions/download-files/${paramsToQueryString(params)}`)
}

const createPaymentIntent = (body: CurrencyValue) => {
  return api.post<StripePaymentIntentPublicInfo>('/users/stripe-payment', body)
}

export default function useTransactionsController() {
  return {
    fetchTransactions,
    fetchTransactionDownloadFiles,
    createPaymentIntent,
  }
}
