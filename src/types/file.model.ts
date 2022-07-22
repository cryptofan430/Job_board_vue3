import { CancelTokenSource } from 'axios'

export interface SimpleAccessFile {
  id: string
  filename: string
  size: number
  signedUrl: string
}

export interface TokenResponse {
  token: string
  expirationDate: string
}

export enum FileUploadState {
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

export interface ViewFileUpload {
  filename: string
  size: number
  state: FileUploadState
  id: null | string
  cancelTokenSource: CancelTokenSource
}

export interface FileUploadPayload {
  id: string
  file: File
  isReady: boolean
  fileUploadedId?: string
  progress: number | null
  cancelTokenSource?: CancelTokenSource
}
