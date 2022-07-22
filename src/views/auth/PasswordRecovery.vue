<template>
  <main class="password-recovery">
    <h1 class="title">New password</h1>
    <p v-if="!isRecoverySucceed" class="message">Please, enter new password.</p>

    <template v-if="isRecoverySucceed">
      <p class="base-info --success">Password reset succeed!</p>
      <p class="additional-info">You’ll be directed to next page automatically.</p>
    </template>

    <AppInputError v-if="passwordRecoveryForm.isError && !isRecoverySucceed" class="email-reset-error">{{
      passwordRecoveryForm.getErrorMessage
    }}</AppInputError>

    <form class="form" @submit.prevent="submitPasswordRecovery">
      <div class="password-container">
        <AppLabel layout="responsive" for="password">Password</AppLabel>

        <div class="password-input-container">
          <AppInput
            id="password"
            v-model="password.value"
            name="password"
            :type="isPasswordVisible ? 'text' : 'password'"
            :error="password.isError"
            responsive
            @update:modelValue="password.setNormalState"
          />

          <button class="show-password-button" type="button" @click.prevent="togglePasswordVisibility">
            <AppIcon name="pass" :pass-visible="isPasswordVisible" />
          </button>
        </div>
        <AppInputError v-if="password.isError">{{ confirmPassword.getErrorMessage }}</AppInputError>
      </div>

      <div class="password-container --confirm-password-container">
        <AppLabel layout="responsive" for="confirm-password">Confirm Password</AppLabel>

        <div class="password-input-container">
          <AppInput
            id="confirm-password"
            v-model="confirmPassword.value"
            name="confirm-password"
            :type="isConfirmPasswordVisible ? 'text' : 'password'"
            :error="confirmPassword.isError"
            responsive
            @update:modelValue="confirmPassword.setNormalState"
          />

          <button class="show-password-button" type="button" @click.prevent="toggleConfirmPasswordVisibility">
            <AppIcon name="pass" :pass-visible="isConfirmPasswordVisible" />
          </button>
        </div>
        <AppInputError v-if="confirmPassword.isError">{{ confirmPassword.getErrorMessage }}</AppInputError>
      </div>

      <AppButton
        class="save-password-button"
        :disabled="isWaitingResponse || isRecoverySucceed"
        :is-loading="isWaitingResponse"
        type="submit"
        >Save password</AppButton
      >
    </form>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppLabel from '@/components/common/AppLabel.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import AppInputError from '@/components/common/AppInputError.vue'
import usePasswordRecovery from '@/components/auth/passwordRecovery/password-recovery'

export default defineComponent({
  name: 'PasswordRecovery',
  components: {
    AppButton,
    AppInput,
    AppLabel,
    AppInputError,
    AppIcon,
  },
  setup() {
    const { passwordRecoveryForm, isWaitingResponse, isRecoverySucceed, submitPasswordRecovery } = usePasswordRecovery()
    const { password, confirmPassword } = toRefs(passwordRecoveryForm.fieldSet)

    const isPasswordVisible = ref(false)
    const togglePasswordVisibility = () => {
      isPasswordVisible.value = !isPasswordVisible.value
    }

    const isConfirmPasswordVisible = ref(false)
    const toggleConfirmPasswordVisibility = () => {
      isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value
    }

    return {
      passwordRecoveryForm,
      password,
      isWaitingResponse,
      isRecoverySucceed,
      confirmPassword,
      isPasswordVisible,
      isConfirmPasswordVisible,
      togglePasswordVisibility,
      toggleConfirmPasswordVisibility,
      submitPasswordRecovery,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/auth/PasswordRecovery';
</style>
