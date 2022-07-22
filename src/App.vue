<template>
  <div id="app-container" :class="classList">
    <AppHeader v-if="!($router.currentRoute.value?.meta?.isChatDialog && isMobile)" />
    <InfoBar v-if="showInfo" />
    <router-view />
    <AppToasts />
    <AppFooter v-if="showFooter" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppFooter from './components/layout/AppFooter.vue'
import AppHeader from './components/layout/AppHeader.vue'
import useWebsocket from '@/middleware/websockets/useWebsocket'
import useNotifications from '@/components/notifications/notifications'
import useUserStore from './store/user'
import useAuthStore from './store/auth'
import useResetStore from './store/reset'
import useUserManagementController from './middleware/controllers/useUserManagementController'
import AppToasts from './components/layout/AppToasts.vue'
import InfoBar from './components/infoBar/InfoBar.vue'
import useAnnouncements from './components/infoBar/announcements'
import { maintenanceMode } from './components/constants/maintenance'
import { getIsMobilePhone } from './components/helpers/dom'
import useChats from './components/chat/sidebar/use-chats'

export default defineComponent({
  name: 'App',
  components: {
    AppFooter,
    AppHeader,
    AppToasts,
    InfoBar,
  },
  setup() {
    const router = useRouter()
    const { getMyProfile } = useUserStore()
    const { initWebsocket, disconnectWebsocket } = useWebsocket()
    const { fetchUserMyProfile } = useUserManagementController()
    const { fetchNotificationsFirstPage } = useNotifications()
    const { checkAnnouncements, getNewAnnouncements } = useAnnouncements()
    const isMobile = getIsMobilePhone()
    const { _fetchSidebarChats } = useChats()

    const { isAuthenticated, accountType } = useAuthStore()
    const { reset } = useResetStore()

    const maintenanceModeStatus = maintenanceMode === 'true'

    watch(router.currentRoute, () => {
      if (maintenanceModeStatus) {
        router.push('/maintenance-mode')
      }
    })

    if (!isAuthenticated.value && router.currentRoute.value.meta?.requiresAuth) {
      router.push('/login')
    }

    if (isAuthenticated.value) {
      fetchUserMyProfile()
      checkAnnouncements()
      // initNotificationsListener()
    } // TODO: may need error handling?

    watch(isAuthenticated, (c) => {
      if (!c) {
        if (router.currentRoute.value.meta?.requiresAuth) {
          router.push('/login')
        }
        reset()
        return
      }

      fetchUserMyProfile()
      checkAnnouncements()
      // initNotificationsListener()
      // TODO:
      // Needs handling when endpoint errors
    })

    watch(accountType, (c) => {
      if (c === null) router.push('/select-account-type')
    })

    watch(getMyProfile, (curr, prev) => {
      if (!prev && curr) {
        fetchNotificationsFirstPage()
        initWebsocket()
        _fetchSidebarChats()
      }
      if (!curr && prev) disconnectWebsocket()
    })

    const showInfo = computed(() => !router.currentRoute.value.meta?.infoHidden)
    const showFooter = computed(() => !router.currentRoute.value.meta?.footerHidden)
    const classList = computed(() => {
      return router.currentRoute.value.meta?.useWhiteBackground ? 'white-background' : ''
    })

    return {
      showFooter,
      showInfo,
      classList,
      getNewAnnouncements,
      isMobile,
    }
  },
})
</script>

<style lang="scss">
@import '@/assets/styles/reset';
@import '@/assets/styles/app';
</style>
