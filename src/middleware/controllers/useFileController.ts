import api, { getBaseURL } from '@/services/api'
import { AxiosRequestConfig } from 'axios'
import { SimpleAccessFile, TokenResponse } from '@/types/file.model'

const getFetchFileUrl = (token: string) => `${getBaseURL.value}/files/${token}`

const uploadFile = async (formData: FormData, config?: AxiosRequestConfig) => {
  return await api.post<SimpleAccessFile>('files', formData, config)
}

const fetchTokenForFile = async (id: string) => {
  return await api.get<TokenResponse>(`files/access-token-for-file/${id}`)
}

export default function useFileController() {
  return {
    getFetchFileUrl,
    uploadFile,
    fetchTokenForFile,
  }
}
