<template>
  <div class="notifications-list">
    <AppSkeleton v-if="isLoading" />

    <AppErrorBox v-else-if="isError" @clicked="refetchNotifications"> notifications </AppErrorBox>

    <AppEmptyBox v-else-if="isLoaded && !getAllNotifications?.length"> No new notifications. </AppEmptyBox>

    <template v-else>
      <NotificationsListItem
        v-for="(notification, i) in getAllNotifications"
        :key="notification.id"
        :notification="notification"
        @seen="markRead(i, notification)"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useNotifications from '@/components/notifications/notifications'
import NotificationsListItem from '@/components/notifications/NotificationsListItem.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import AppErrorBox from '@/components/common/AppErrorBox.vue'
import AppEmptyBox from '@/components/common/AppEmptyBox.vue'
import { NotificationPublicInfo } from '@/types/notification.model'

export default defineComponent({
  name: 'NotificationsList',
  components: {
    NotificationsListItem,
    AppSkeleton,
    AppErrorBox,
    AppEmptyBox,
  },
  setup() {
    const { getAllNotifications, isLoading, isLoaded, isError, refetchNotifications, markNotificationRead } =
      useNotifications()

    const markRead = (i: number, notification: NotificationPublicInfo) => {
      if (i === 0) markNotificationRead(notification)
    }

    return {
      isLoading,
      isLoaded,
      isError,
      getAllNotifications,
      refetchNotifications,
      markRead,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/notifications/NotificationsList';
</style>
