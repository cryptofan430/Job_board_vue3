export interface CurrencyListResponse {
  currencies: Array<CurrencyWithEurExchange>
}

export interface CurrencyWithEurExchange {
  currency: Currency
  exchangeToEur: number
  scale: number
}

// below up to date

export interface CurrencyValue {
  value: number
  currency: Currency
}

export interface CurrencyMoney {
  amount: number
  currency: Currency
}

export enum Currency {
  USD = 'USD',
  PLN = 'PLN',
  EUR = 'EUR',
  BTC = 'BTC',
}

export interface ExchangeFundsRequest {
  baseCurrency: Currency
  exchangeCurrency: Currency
  value: number
}
