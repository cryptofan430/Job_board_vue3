<template>
  <div class="popup">
    <div class="popup-content">
      <AppBackButton button-text="Back" :back-route="{ name: $route.meta.backRoute }" class="popup-back-button" />
      <AppCloseButton class="popup-close-button" @click="onClose" />

      <h3 class="popup-title">Please, enter new email.</h3>

      <AppLabel>
        Email
        <AppInput responsive class="popup-input" />
      </AppLabel>

      <AppButton class="action-button">Save</AppButton>

      <p class="additional-info">Please, don’t forget to use link we send on your email to login.</p>
      <p class="no-email-info">I haven’t got an email</p>
      <button class="resend-button">Resend link</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppCloseButton from '@/components/common/AppCloseButton.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppLabel from '@/components/common/AppLabel.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppBackButton from '@/components/common/AppBackButton.vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'PopupNewEmail',
  components: {
    AppCloseButton,
    AppBackButton,
    AppButton,
    AppLabel,
    AppInput,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const onClose = () => {
      router.push({ name: route.meta.backRoute as string })
    }

    return { onClose }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/popups/PopupNewEmail';
</style>
