<template>
  <div ref="rootElement" class="menu" tabindex="0">
    <div class="menu-content-wrapper">
      <template v-if="!isAuthenticated">
        <router-link class="login-link" to="/login">Login</router-link>

        <AppLink to="/register">Register</AppLink>
      </template>
      <template v-else>
        <template v-if="isMarketer">
          <router-link class="mobile-menu-item" :to="`/m/profile/${getMyProfile?.id}`">
            <AppIcon name="profile" size="md" :outline="false" />
            <span class="mobile-menu-item-text profile-text">My profile</span>
          </router-link>
        </template>

        <template v-if="isInfluencer">
          <div class="mobile-menu-item">
            <router-link class="mobile-menu-item-text" to="/i/tasks/search">Find job</router-link>
          </div>
          <div class="mobile-menu-item">
            <router-link class="mobile-menu-item-text" to="/i/tasks">Tasks</router-link>
          </div>
        </template>

        <div class="mobile-menu-item-list">
          <div>
            <div class="account-list-item">
              <router-link class="mobile-menu-item" to="/chat">
                <AppIcon name="chat" size="md" :outline="false" />
                <span class="mobile-menu-item-text">Messages</span>
              </router-link>
            </div>
            <div class="account-list-item">
              <router-link class="mobile-menu-item" to="/notifications">
                <AppIcon name="notification" size="md" :outline="false" />
                <span class="mobile-menu-item-text">Notifications</span>
              </router-link>
            </div>
            <div class="account-list-item">
              <router-link class="mobile-menu-item" to="/settings">
                <AppIcon name="settings" size="md" :outline="false" />
                <span class="mobile-menu-item-text">Settings</span>
              </router-link>
            </div>
          </div>

          <div v-if="isMarketer" class="account-list-item">
            <div class="marketer-links">
              <AppLink to="/create-task">Create task</AppLink>
            </div>
          </div>
        </div>

        <div v-if="getMyProfile" class="accounts-list">
          <div>
            <span class="mobile-menu-item-text">Switch account</span>
          </div>
          <div>
            <div class="second-account-list-item">
              <button class="account-switch-button" @click="setMarketer">
                <span class="name">{{ getMyProfile?.marketer.firstName }} {{ getMyProfile?.marketer.lastName }}</span>
                <span class="dot"></span>
                <span class="account-type">Marketer</span>
              </button>
            </div>
            <div class="second-account-list-item" @click="setInfluencer">
              <button class="account-switch-button">
                <span class="name"
                  >{{ getMyProfile?.influencer.firstName }} {{ getMyProfile?.influencer.lastName }}</span
                >
                <span class="dot"></span>
                <span class="account-type">Influencer</span>
              </button>
            </div>
          </div>
        </div>

        <button class="logout-button" @click="logout">
          <AppIcon name="logout" />
          <span class="text">Log out</span>
        </button>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import useUserAuthentificationController from '@/middleware/controllers/useUserAuthentificationController'
import useAuthStore from '@/store/auth'
import AppLink from '../common/AppLink.vue'
import AppIcon from '../common/AppIcon.vue'
import useUserStore from '@/store/user'

export default defineComponent({
  name: 'AppMobileMenu',
  components: { AppIcon, AppLink },
  props: {
    isAuthenticated: {
      type: Boolean,
      required: false,
    },
    isMarketer: {
      type: Boolean,
      required: false,
    },
    isInfluencer: {
      type: Boolean,
      required: false,
    },
  },
  setup() {
    const router = useRouter()
    const { accountType } = useAuthStore()
    const { logout } = useUserAuthentificationController()
    const { getMyProfile } = useUserStore()

    const setInfluencer = () => {
      if (accountType.value !== 'influencer') {
        accountType.value = 'influencer'
        router.push('/i/tasks/search')
      }
    }
    const setMarketer = () => {
      if (accountType.value !== 'marketer') {
        accountType.value = 'marketer'
        router.push('/m/dashboard')
      }
    }

    const rootElement = ref<HTMLElement | null>(null)

    onMounted(() => {
      rootElement.value?.focus()
    })

    return {
      setInfluencer,
      setMarketer,
      logout,
      getMyProfile,
      rootElement,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/layout/AppMobileMenu';
</style>
