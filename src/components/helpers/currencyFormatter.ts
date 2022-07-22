import { Currency } from '@/types/money.model'

const influencerIncomeMultiplier = 0.8

export const getCurrencySign = (currency: Currency) => {
  if (currency === Currency.USD) return '$'
  if (currency === Currency.EUR) return '€'
  if (currency === Currency.PLN) return 'PLN '
  if (currency === Currency.BTC) return 'BTC '
}

export const calcInfluencerIncome = (totalBudget: number) => totalBudget * influencerIncomeMultiplier
