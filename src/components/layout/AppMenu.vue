<template>
  <div ref="rootElement" class="menu" tabindex="0">
    <div class="menu-content-wrapper">
      <span class="message">Switch account</span>

      <ul v-if="getMyProfile" class="accounts-list">
        <li class="account-list-item">
          <button class="account-switch-button" @click="setMarketer">
            <span class="name">{{ getMyProfile?.marketer.firstName }} {{ getMyProfile?.marketer.lastName }}</span>
            <span class="dot"></span>
            <span class="account-type">Marketer</span>
          </button>
        </li>
        <li class="account-list-item" @click="setInfluencer">
          <button class="account-switch-button">
            <span class="name">{{ getMyProfile?.influencer.firstName }} {{ getMyProfile?.influencer.lastName }}</span>
            <span class="dot"></span>
            <span class="account-type">Influencer</span>
          </button>
        </li>
      </ul>

      <button class="logout-button" @click="logout">
        <AppIcon name="logout" />
        <span class="text">Log out</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import useUserAuthentificationController from '@/middleware/controllers/useUserAuthentificationController'
import useAuthStore from '@/store/auth'
import AppIcon from '../common/AppIcon.vue'
import useUserStore from '@/store/user'

export default defineComponent({
  name: 'AppMenu',
  components: { AppIcon },
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
@import '@/assets/styles/components/layout/AppMenu';
</style>
