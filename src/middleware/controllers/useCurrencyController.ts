import api from '@/services/api'
import { CurrencyListResponse } from '@/types/money.model'

export default function useCurrencyController() {
  const fetchCurrencies = async () => {
    return await api.get<CurrencyListResponse>('currencies')
  }

  return { fetchCurrencies }
}
