<template>
  <div ref="notificationElementRef" class="notification">
    <div>
      <p class="content">
        {{ notification.message }}
      </p>

      <span class="date">{{ date.day }} {{ date.humanMonth }}</span>
    </div>

    <div class="actions">
      <div class="notification-action-container">
        <NotificationAction :notification="notification" />
      </div>
    </div>
  </div>
  <div class="notification-mobile-action-container">
    <NotificationAction :notification="notification" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, PropType, ref } from 'vue'
import variables from '@/assets/variables'
import { getDate } from '@/components/helpers/timeFormatter'
import { NotificationWithTypeInfo } from '@/types/notification.model'
import NotificationAction from '@/components/notifications/NotificationAction.vue'

export default defineComponent({
  name: 'NotificationsListItem',
  components: {
    NotificationAction,
  },
  props: {
    notification: {
      type: Object as PropType<NotificationWithTypeInfo>,
      required: true,
    },
  },
  emits: ['seen'],
  setup(props, { emit }) {
    const notificationElementRef = ref<HTMLElement | null>(null)
    const date = computed(() => getDate(props.notification?.date))

    const observeNotificationSeen = () => {
      const target = notificationElementRef.value

      if (!target) return

      const observer = new IntersectionObserver((entries) => {
        const markAsSeen = () => {
          if (!props.notification.read) emit('seen', props.notification)
        }

        const targetEntry = entries[0]
        const { isIntersecting } = targetEntry

        if (isIntersecting) {
          observer.unobserve(target)
          observer.disconnect()
          markAsSeen()
        }
      })

      onBeforeUnmount(() => {
        observer.unobserve(target)
        observer.disconnect()
      })

      if (target) observer.observe(target)
    }

    onMounted(observeNotificationSeen)

    return {
      notificationElementRef,
      variables,
      date,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/notifications/Notification';
</style>
