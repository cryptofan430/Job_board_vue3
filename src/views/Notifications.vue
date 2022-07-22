<template>
  <main class="notifications">
    <h1 class="title">Notifications</h1>

    <div class="notifications-container">
      <NotificationsList />
    </div>

    <AppPagination
      v-if="isLoaded && getAllNotifications?.length"
      :active-page="activePage"
      :count="getAllNotificationsCount"
      :per-page="notificationsPerPage"
      @page-change="updatePage"
    />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NotificationsList from '@/components/notifications/NotificationsList.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import useNotifications from '@/components/notifications/notifications'

export default defineComponent({
  name: 'Notifications',
  components: {
    NotificationsList,
    AppPagination,
  },
  setup() {
    const {
      getAllNotifications,
      getAllNotificationsCount,
      activePage,
      isLoaded,
      notificationsPerPage,
      updatePage,
      watchPageLimits,
      watchFilters,
      fetchNotificationsInitial,
    } = useNotifications()

    watchFilters()

    if (activePage.value !== 1) {
      fetchNotificationsInitial()
    }

    watchPageLimits()

    return {
      activePage,
      getAllNotifications,
      getAllNotificationsCount,
      isLoaded,
      notificationsPerPage,
      updatePage,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/notifications/Notifications';
</style>
