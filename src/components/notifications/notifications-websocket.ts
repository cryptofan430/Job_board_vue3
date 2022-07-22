import useAllNotificationsStore from '@/store/notifications'
import useToastsStore from '@/store/toasts'
import { NotificationsResponse, NotificationType, NotificationWithTypeInfo } from '@/types/notification.model'
import { extractNotificationsList } from '@/components/helpers/notifications'
import { notificationsCache } from './notifications'
import { notificationsPerPage } from '../constants/notifications'
import useUserManagementController from '@/middleware/controllers/useUserManagementController'

export default function useNotificationsWebsocket() {
  const { addToast } = useToastsStore()
  const { getAllNotifications, getAllNotificationsCount, setAllNotifications, setAllNotificationsCount } =
    useAllNotificationsStore()
  const { fetchUserMyProfile } = useUserManagementController()

  const addNotification = (notification: NotificationWithTypeInfo) => {
    const currentNotifications = [...getAllNotifications.value]
    currentNotifications.unshift(notification)
    const incrementedNotificationsCount = getAllNotificationsCount.value + 1
    setAllNotificationsCount(incrementedNotificationsCount)

    if (currentNotifications.length > notificationsPerPage) {
      currentNotifications.pop()
    }
    setAllNotifications(currentNotifications)
    notificationsCache.clear()
    notificationsCache.set(1, currentNotifications)
  }

  const addNotificationFromResponse = (response: NotificationsResponse) => {
    const notifications = extractNotificationsList(response.notifications)
    const notification = notifications[0]

    if (notification?.notificationType === NotificationType.STRIPE_PAYMENT_SUCCEEDED) {
      fetchUserMyProfile()
    }

    if (notification) {
      addNotification(notification)
      const notificationMessage = typeof notification.message === 'string' ? notification.message : 'New notification'
      addToast(notificationMessage, 'base')
    }
  }

  return {
    addNotificationFromResponse,
  }
}
