import { computed, reactive, readonly, Ref, ref } from 'vue'
import { NotificationWithTypeInfo } from '@/types/notification.model'
import { ApiLoadingState, EntitiesLoadingState } from '@/types/api.model'

const allNotifications = ref<Array<NotificationWithTypeInfo>>([])
const allNotificationsCount: Ref<number> = ref(0)
const allNotificationsState = reactive<EntitiesLoadingState>({
  state: 'loading',
  payload: {
    message: undefined,
  },
})

export default function useAllNotificationsStore() {
  const getAllNotifications = computed(() => allNotifications.value)
  const getAllNotificationsCount = readonly(allNotificationsCount)
  const getAllNotificationsState = computed(() => allNotificationsState)

  const setAllNotifications = (notifications: Array<NotificationWithTypeInfo>) => {
    allNotifications.value = notifications
  }
  const getFirstNotification = () => allNotifications.value[0] || null
  const getLastNotification = () => allNotifications.value[allNotifications.value.length - 1] || null
  const setAllNotificationsCount = (newNotificationsCount: number) =>
    (allNotificationsCount.value = newNotificationsCount)

  const reset = () => {
    allNotifications.value = []
    allNotificationsCount.value = 0
    allNotificationsState.state = 'loading'
    allNotificationsState.payload = {
      message: undefined,
    }
  }

  const setNewAllNotificationsState = (state: ApiLoadingState, payload?: { message?: string }) => {
    allNotificationsState.state = state
    allNotificationsState.payload = payload
  }

  return {
    getAllNotifications,
    getAllNotificationsCount,
    getAllNotificationsState,
    reset,
    setAllNotifications,
    setAllNotificationsCount,
    getFirstNotification,
    getLastNotification,
    setNewAllNotificationsState,
  }
}
