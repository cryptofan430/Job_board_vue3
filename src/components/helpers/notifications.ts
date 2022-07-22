import { NotificationPayload, NotificationWithTypeInfo } from '@/types/notification.model'

export const extractNotificationsList = (notificationsMap: NotificationPayload) => {
  const notificationKeys = Object.keys(notificationsMap) as (keyof typeof notificationsMap)[]
  const notifications: NotificationWithTypeInfo[] = []
  notificationKeys.forEach((key) =>
    notifications.push(...notificationsMap[key].map((not) => ({ ...not, notificationType: key })))
  )

  const sortedNotifications = notifications.sort((n1, n2) => new Date(n2.date).valueOf() - new Date(n1.date).valueOf())

  return sortedNotifications
}
