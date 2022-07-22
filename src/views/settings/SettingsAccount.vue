<template>
  <section v-if="!isMobilePopup" class="settings-account">
    <div class="box email-box">
      <h2 class="title">Email</h2>
      <p class="email">myemail@email.com</p>
      <AppLink :to="{ name: 'PopupNewEmail' }">Change email</AppLink>
    </div>
    <div class="mobile-email-change-button">
      <AppLink :to="{ name: 'PopupNewEmail' }">Change email</AppLink>
    </div>

    <div class="box email-box">
      <h2 class="title">Password</h2>
      <p class="password-info">Password has been set.</p>
      <AppLink :to="{ name: 'PopupNewPassword' }">Change password</AppLink>
    </div>
    <div class="mobile-password-change-button">
      <AppLink :to="{ name: 'PopupNewPassword' }">Change password</AppLink>
    </div>

    <div class="box email-box">
      <h2 class="title">My account</h2>
      <AppLink :to="{ name: 'SettingsDeleteAccountPopup' }" outlined>Delete Account</AppLink>
    </div>
    <div class="mobile-account-delete-button">
      <AppLink :to="{ name: 'SettingsDeleteAccountPopup' }" outlined>Delete Account</AppLink>
    </div>
  </section>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppLink from '@/components/common/AppLink.vue'
import { getIsMobilePopup } from '@/components/helpers/dom'

export default defineComponent({
  name: 'SettingsAccount',
  components: {
    AppLink,
  },
  setup() {
    const isMobilePopup = getIsMobilePopup()

    return {
      isMobilePopup,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/SettingsAccount';
</style>
