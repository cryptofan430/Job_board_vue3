import api, { paramsToQueryString } from '@/services/api'
import { BasicPagination } from '@/types/api.model'
import { NotificationsResponse } from '@/types/notification.model'

const fetchNotifications = async (pagination?: BasicPagination) => {
  return await api.get<NotificationsResponse>(`notifications/${paramsToQueryString(pagination)}`)
}

const markNotificationAsRead = async (notificationId: string) => {
  return await api.post<Record<string, never>>(`/notifications/${notificationId}/mark-read`)
}

export default function useNotificationsController() {
  return {
    fetchNotifications,
    markNotificationAsRead,
  }
}
