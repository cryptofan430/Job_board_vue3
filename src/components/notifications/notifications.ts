import { computed, watch } from 'vue'
import { PaginationWithPage } from '@/types/api.model'
import { NotificationPublicInfo, NotificationWithTypeInfo } from '@/types/notification.model'
import { createPageLimitsWatcher, fetchEntitiesFactory } from '@/components/helpers/api'
import { extractNotificationsList } from '@/components/helpers/notifications'
import useNotificationsController from '@/middleware/controllers/useNotificationsController'
import useNotificationFilters from './notification-filters'
import useAllNotificationsStore from '@/store/notifications'
import useToastsStore from '@/store/toasts'

export const notificationsCache = new Map<number, NotificationPublicInfo[]>()

export default function useNotifications() {
  const { fetchNotifications, markNotificationAsRead } = useNotificationsController()
  const { addToast } = useToastsStore()
  const {
    getAllNotifications,
    getAllNotificationsCount,
    getAllNotificationsState,
    setAllNotifications,
    setAllNotificationsCount,
    setNewAllNotificationsState,
    getFirstNotification,
    getLastNotification,
  } = useAllNotificationsStore()
  const { notificationsPagination, notificationsPerPage, paginationPayload, updateRouteParams } =
    useNotificationFilters()

  const activePage = computed(() => notificationsPagination.skip / notificationsPagination.limit + 1)
  const isLoading = computed(() => getAllNotificationsState.value.state === 'loading')
  const isLoaded = computed(() => getAllNotificationsState.value.state === 'loaded')
  const isError = computed(() => getAllNotificationsState.value.state === 'error')

  const scrollToPageTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const _fetchNotifications = async (params: PaginationWithPage) => {
    const {
      currentPageEntities: cachedNotifications,
      calcEntitiesCount,
      extractCurrentEntities,
      updatedParams,
    } = fetchEntitiesFactory(params, notificationsCache)

    if (cachedNotifications) setAllNotifications(cachedNotifications as NotificationWithTypeInfo[])

    if (extractCurrentEntities) {
      return await fetchNotifications(updatedParams).then((response) => {
        const notifications = extractNotificationsList(response.data.notifications)

        const { currentPageEntities } = extractCurrentEntities(notifications)
        if (calcEntitiesCount) setAllNotificationsCount(calcEntitiesCount(response.data.count))
        if (!cachedNotifications) setAllNotifications(currentPageEntities as NotificationWithTypeInfo[])
      })
    }
  }

  const fetchNotificationsInitial = () => {
    _fetchNotifications({
      ...notificationsPagination,
      targetPage: activePage.value,
    })
      .then(() => setNewAllNotificationsState('loaded'))
      .catch((e) => setNewAllNotificationsState('error', { message: e?.message }))
  }

  const refetchNotifications = () => {
    setNewAllNotificationsState('loading')

    fetchNotificationsInitial()
  }

  const fetchNotificationsFirstPage = () => {
    if (!notificationsCache.get(1)) {
      setNewAllNotificationsState('loading')
    }

    _fetchNotifications({ skip: 0, limit: notificationsPerPage, targetPage: 1 })
      .then(() => setNewAllNotificationsState('loaded'))
      .catch((e) => {
        setNewAllNotificationsState('error', { message: e?.message })
        addToast('Failed to load notifications', 'danger')
      })
  }

  const updatePage = (targetPage: number) => {
    scrollToPageTop()
    const firstNotification = getFirstNotification()
    const lastNotification = getLastNotification()

    paginationPayload.newerThanId = firstNotification?.id
    paginationPayload.olderThanId = lastNotification?.id
    paginationPayload.currentPage = activePage.value

    updateRouteParams({ page: targetPage })
  }

  const watchPageLimits = createPageLimitsWatcher(getAllNotifications, getAllNotificationsCount, activePage, updatePage)

  const watchFilters = () => {
    watch(notificationsPagination, fetchNotificationsInitial)
  }

  const markNotificationRead = (notification: NotificationPublicInfo) => {
    markNotificationAsRead(notification.id)
      .then(() => {
        notification.read = true
      })
      .catch(() => null)
  }

  return {
    getAllNotifications,
    getAllNotificationsCount,
    activePage,
    isLoading,
    isLoaded,
    isError,
    notificationsPerPage,
    fetchNotificationsFirstPage,
    markNotificationRead,
    fetchNotificationsInitial,
    refetchNotifications,
    updatePage,
    watchFilters,
    watchPageLimits,
  }
}
