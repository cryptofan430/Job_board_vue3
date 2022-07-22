import { computed } from 'vue'
import { useRoute, useRouter, LocationQueryRaw } from 'vue-router'
import { withoutNullishValues } from './utils'

const useUrlQueryParam = (paramName: string) => {
  const { query } = useRoute()
  return query[paramName]
}

export const useStringUrlParam = (paramName: string) => {
  const paramValue = useUrlQueryParam(paramName)

  if (!paramValue) return
  if (typeof paramValue === 'string') return paramValue
  if (Array.isArray(paramValue)) return paramValue.join('')
}

export const useArrayUrlParam = (paramName: string) => {
  const paramValue = useUrlQueryParam(paramName)

  if (!paramValue) return
  if (typeof paramValue === 'string') return paramValue.split(',')
  if (Array.isArray(paramValue)) return paramValue.filter(Boolean).map(String)
}

export const useNumericUrlParam = (paramName: string) => {
  const paramValue = useUrlQueryParam(paramName)

  if (Array.isArray(paramValue)) return
  if (!paramValue) return

  const numericParamValue = +paramValue
  if (numericParamValue || numericParamValue === 0) return numericParamValue
}

export const useUpdateQueryParams = () => {
  const { push, currentRoute } = useRouter()

  return (params?: LocationQueryRaw) => {
    const newParams = { ...currentRoute.value.query, ...params }
    const notNullishParams = withoutNullishValues(newParams)

    push({ query: notNullishParams })
    return params
  }
}

export const useNumericUrlParamReactive = (paramName: string) => {
  const route = useRoute()

  return computed(() => {
    const paramValue = route.query[paramName]

    if (Array.isArray(paramValue)) return
    if (paramValue == null) return

    const numericParamValue = +paramValue
    return numericParamValue
  })
}

export const useArrayUrlParamReactive = (paramName: string) => {
  const route = useRoute()

  return computed(() => {
    const paramValue = route.query[paramName]

    if (paramValue == null) return
    if (typeof paramValue === 'string') return paramValue.split(',')
    if (!Array.isArray(paramValue)) return
    return paramValue.filter(Boolean).map(String)
  })
}

export const useStringUrlParamReactive = (paramName: string) => {
  const route = useRoute()

  return computed(() => {
    const paramValue = route.query[paramName]

    if (paramValue == null) return
    if (typeof paramValue === 'string') return paramValue
    if (Array.isArray(paramValue)) paramValue.join('')
    return undefined
  })
}

export const useStringPathParamReactive = (paramName: string) => {
  const route = useRoute()

  return computed(() => {
    return route.params[paramName]?.toString() || ''
  })
}

export const useBooleanQueryParamReactive = (paramName: string) => {
  const route = useRoute()

  return computed(() => {
    if (route.query[paramName]?.toString() === 'true') {
      return true
    }
    if (route.query[paramName]?.toString() === 'false') {
      return false
    }
    return undefined
  })
}

export const useStringUrlHashParam = (paramName: string) => {
  const route = useRoute()
  const hashString = route.hash.split('#')[1]

  if (typeof hashString !== 'string') return

  const mapped = hashString.split('&').map((el) => {
    const pair = el.split('=')
    return { key: pair[0], value: pair[1] }
  })

  const paramPair = mapped.find((e) => e.key === paramName)

  if (!paramPair?.value) return
  return paramPair.value
}

export const resetUrlQuery = () => {
  const { push } = useRouter()
  push({ query: {} })
}

export const resetUrlHash = () => {
  const { push } = useRouter()
  push({ hash: '' })
}
