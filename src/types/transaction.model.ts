import { SimpleAccessFile } from './file.model'
import { CurrencyMoney, CurrencyValue } from './money.model'

export interface TransactionsResponse {
  transactions: Array<TransactionPublicInfo>
  count: number
}

export interface TransactionDownloadFilesParams {
  fromDate?: string
  toDate?: string
  state: 'MARKETER' | 'INFLUENCER'
}

export interface TransactionPublicInfo {
  id: string
  type: TransactionType
  money: CurrencyValue
  description?: string
  file?: SimpleAccessFile
  date: string
  state: TransactionState
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  MILESTONE_PAYMENT = 'MILESTONE_PAYMENT',
  MILESTONE_RELEASED = 'MILESTONE_RELEASED',
  MILESTONE_RECEIVED = 'MILESTONE_RECEIVED',
  SERVICE_FEE = 'SERVICE_FEE',
  DISPUTE_REFUND = 'DISPUTE_REFUND',
}

export enum TransactionState {
  INFLUENCER = 'INFLUENCER',
  MARKETER = 'MARKETER',
}

export interface StripePaymentIntentPublicInfo {
  id: string
  money: CurrencyMoney
  clientSecret: string
}
