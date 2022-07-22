export type ToastType = 'success' | 'warning' | 'danger' | 'base'

export interface Toast {
  type: ToastType
  content: string
  id: number
  remove: () => void
}
