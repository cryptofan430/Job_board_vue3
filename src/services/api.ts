import axios, { AxiosError } from 'axios'
import { computed } from 'vue'
import { ApiErrors, QueryParams } from '@/types/api.model'
import useAuthStore from '@/store/auth'

const api = axios.create({
  baseURL: 'https://003.freelanceinfluence.xyz',
  withCredentials: true,
})

const auth = useAuthStore()

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error?.response?.status === 403) auth.isAuthenticated.value = false
    return Promise.reject(error)
  }
)

export default api

const getBaseURL = computed(() => api.defaults.baseURL)

const paramsToQueryString = (params?: QueryParams) => {
  if (!params) return ''

  const queryArray: Array<string> = []
  for (const [k, v] of Object.entries(params)) {
    if (v || v === 0) {
      if (Array.isArray(v)) {
        if (v.length) {
          Object.values(v).forEach((el) => {
            if (el.length) {
              queryArray.push(`${k}=${el}`)
            }
          })
        }
      } else {
        queryArray.push(`${k}=${v}`)
      }
    }
  }

  if (!queryArray.length) return ''
  return `?${queryArray.join('&')}`
}

const errorMessagesToString = (error: AxiosError) => {
  let errorsString = ''

  if (error?.response?.data?.errors) {
    const requestErrors = error.response.data.errors as ApiErrors

    requestErrors.forEach((e) => {
      if (!errorsString.length) errorsString = e.message
      else errorsString = `${errorsString}\n${e.message}`
    })
  }

  if (!errorsString && error?.response?.data?.message) {
    errorsString = error?.response?.data?.message
  }

  return errorsString
}

const getFirstError = <T extends string = string>(error: AxiosError) => {
  if (error?.response?.data?.errors?.length) {
    return error?.response?.data?.errors[0] as {
      errorType: T
      message: string
    }
  }
  return null
}

export { getBaseURL, paramsToQueryString, errorMessagesToString, getFirstError }
