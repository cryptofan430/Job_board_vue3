<template>
  <header class="header">
    <nav class="nav">
      <template v-if="isMobileMenuOpen">
        <router-link class="logo-container-open-mobile" to="/">
          <AppIcon name="logotype" />
        </router-link>

        <router-link class="logo-sm-container-open-mobile" to="/">
          <AppIcon name="logotype" size="sm" />
        </router-link>

        <div class="mobile-menu-close-btn-container" @focusin="keepMenuOpened" @focusout="setDelayedClose">
          <button class="menu-button" @click="toggleMobileMenuOpen">
            <AppIcon name="close" :color="variables.cGrey000" :fill="variables.cGrey800" />
          </button>
          <AppMobileMenu
            v-if="isMobileMenuOpen"
            :is-authenticated="isAuthenticated"
            :is-marketer="isMarketer"
            :is-influencer="isInfluencer"
          />
        </div>
      </template>
      <template v-else>
        <router-link class="logo-container" to="/">
          <AppIcon name="logotype" />
        </router-link>

        <router-link class="logo-sm-container" to="/">
          <AppIcon name="logotype" size="sm" />
        </router-link>

        <div class="mobile-menu-open-btn-container" @focusin="keepMenuOpened" @focusout="setDelayedClose">
          <button class="menu-button" @click="toggleMobileMenuOpen">
            <AppIcon name="menu" :color="variables.cGrey000" :fill="variables.cGrey800" />
          </button>
          <AppMobileMenu
            v-if="isMobileMenuOpen"
            :is-authenticated="isAuthenticated"
            :is-marketer="isMarketer"
            :is-influencer="isInfluencer"
          />
        </div>
      </template>

      <div class="right-side">
        <div v-if="!isAuthenticated" class="auth-links">
          <router-link class="login-link" to="/login">Login</router-link>

          <AppLink to="/register">Register</AppLink>
        </div>

        <template v-else>
          <div v-if="isMarketer" class="marketer-links">
            <AppLink to="/create-task">Create task</AppLink>
          </div>

          <div v-else-if="isInfluencer" class="influencer-links">
            <router-link class="find-job-link" to="/i/tasks/search">Find job</router-link>

            <router-link class="tasks-link" to="/i/tasks">Tasks</router-link>
          </div>
        </template>

        <template v-if="isAuthenticated">
          <div class="user-common-links">
            <router-link class="chat-link" to="/chat">
              <AppIcon name="chat" :notify="showChatMark" />
            </router-link>

            <router-link class="notification-link" to="/notifications">
              <AppIcon name="notification" :notify="showNewNotificationMark" />
            </router-link>

            <router-link class="settings-link" to="/settings">
              <AppIcon name="settings" />
            </router-link>
          </div>

          <div @focusin="keepMenuOpened" @focusout="setDelayedClose">
            <button class="menu-button" @click="toggleMenuOpen">
              <AppIcon name="profile" :color="variables.cGrey000" :fill="variables.cGrey800" />
            </button>
            <AppMenu v-if="isAuthenticated && isMenuOpen" />
          </div>
        </template>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '../../common/AppIcon.vue'
import AppMenu from '../AppMenu.vue'
import AppMobileMenu from '../AppMobileMenu.vue'
import variables from '@/assets/variables'
import AppLink from '../../common/AppLink.vue'
import useAuthStore from '@/store/auth'
import useAllNotificationsStore from '@/store/notifications'
import useChatStore from '@/store/chat'

export default defineComponent({
  name: 'ContentHeader',
  components: {
    AppIcon,
    AppMenu,
    AppLink,
    AppMobileMenu,
  },
  setup() {
    const { getAllNotifications } = useAllNotificationsStore()
    const { getSidebarChats } = useChatStore()
    const router = useRouter()
    const timer = ref<number | null>()

    const showNewNotificationMark = computed(() => {
      return !getAllNotifications?.value?.[0]?.read && !!getAllNotifications?.value?.[0]
    })
    const showChatMark = computed(() => {
      return getSidebarChats.value.some(({ unreadMessages }) => unreadMessages)
    })

    const { isAuthenticated, accountType } = useAuthStore()
    const isMarketer = computed(() => accountType.value === 'marketer')
    const isInfluencer = computed(() => accountType.value === 'influencer')

    const isMenuOpen = ref(false)
    const isMobileMenuOpen = ref(false)

    const keepMenuOpened = () => {
      if (timer.value) {
        clearTimeout(timer.value)
        timer.value = null
      }
    }

    const setDelayedClose = () => {
      if (timer.value) {
        keepMenuOpened()
      }
      timer.value = setTimeout(() => {
        isMenuOpen.value = false
        isMobileMenuOpen.value = false
      })
    }

    const toggleMenuOpen = () => {
      isMenuOpen.value = !isMenuOpen.value
    }

    const toggleMobileMenuOpen = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value
    }

    watch(router.currentRoute, () => {
      isMenuOpen.value = false
      isMobileMenuOpen.value = false
    })

    return {
      variables,
      isAuthenticated,
      isMarketer,
      isInfluencer,
      isMenuOpen,
      isMobileMenuOpen,
      showNewNotificationMark,
      showChatMark,
      toggleMenuOpen,
      toggleMobileMenuOpen,
      keepMenuOpened,
      setDelayedClose,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/layout/AppHeaderComponent/ContentHeader';
</style>
