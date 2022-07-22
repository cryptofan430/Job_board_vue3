<template>
  <div class="popup">
    <div class="popup-content">
      <AppBackButton button-text="Back" :back-route="{ name: $route.meta.backRoute }" class="popup-back-button" />
      <AppCloseButton class="popup-close-button" @click="onClose" />

      <h3 class="popup-title">Please, enter new password.</h3>

      <div class="password-container">
        <AppLabel>
          Password

          <div class="password-input-container">
            <AppInput
              v-model="password"
              class="popup-input"
              responsive
              :type="isPasswordVisible ? 'text' : 'password'"
            />

            <button class="show-password-button" type="button" @click.prevent="togglePasswordVisibility">
              <AppIcon name="pass" :pass-visible="isPasswordVisible" />
            </button>
          </div>
        </AppLabel>

        <AppInputError v-if="false">Error</AppInputError>
      </div>

      <div class="password-container">
        <AppLabel>
          Confirm Password

          <div class="password-input-container">
            <AppInput
              v-model="confirmPassword"
              class="popup-input"
              responsive
              :type="isConfirmPasswordVisible ? 'text' : 'password'"
            />

            <button class="show-password-button" type="button" @click.prevent="toggleConfirmPasswordVisibility">
              <AppIcon name="pass" :pass-visible="isConfirmPasswordVisible" />
            </button>
          </div>
        </AppLabel>

        <AppInputError v-if="false">Error</AppInputError>
      </div>

      <AppButton class="action-button">Save password</AppButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import AppCloseButton from '@/components/common/AppCloseButton.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppLabel from '@/components/common/AppLabel.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import AppInputError from '@/components/common/AppInputError.vue'
import AppBackButton from '@/components/common/AppBackButton.vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'PopupNewPassword',
  components: {
    AppCloseButton,
    AppInputError,
    AppButton,
    AppInput,
    AppLabel,
    AppIcon,
    AppBackButton,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const onClose = () => {
      router.push({ name: route.meta.backRoute as string })
    }

    const password = ref('')
    const confirmPassword = ref('')

    const isPasswordVisible = ref(false)
    const isConfirmPasswordVisible = ref(false)

    const togglePasswordVisibility = () => {
      isPasswordVisible.value = !isPasswordVisible.value
    }
    const toggleConfirmPasswordVisibility = () => {
      isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value
    }

    return {
      onClose,
      password,
      confirmPassword,
      isPasswordVisible,
      isConfirmPasswordVisible,
      togglePasswordVisibility,
      toggleConfirmPasswordVisibility,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/settings/popups/PopupNewPassword';
</style>
