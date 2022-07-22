<template>
  <main class="forgot-password">
    <h1 class="title">Forgot password?</h1>
    <p v-if="!isPasswordRecoverySend" class="message">Don't worry! Just enter the email you use to log in.</p>
    <p v-if="!isPasswordRecoverySend" class="message-sm">Don't worry!</p>
    <p v-if="!isPasswordRecoverySend" class="message-sm">Just enter the email you use to log in.</p>
    <p v-if="isPasswordRecoverySend" class="base-info --success">Verification message is send to your email</p>

    <form v-if="!isPasswordRecoverySend" class="form" @submit.prevent="submitForgotPassword">
      <div class="email-container">
        <AppLabel layout="responsive" for="email">Email</AppLabel>
        <AppInputError v-if="forgotPasswordForm.isError" class="email-reset-error">{{
          forgotPasswordForm.getErrorMessage
        }}</AppInputError>
        <AppInput
          id="email"
          v-model="email.value"
          name="email"
          :error="email.isError"
          responsive
          @update:modelValue="email.setNormalState"
        />
        <AppInputError v-if="email.isError">{{ email.getErrorMessage }}</AppInputError>
      </div>

      <AppButton class="reset-button" :disabled="isWaitingResponse" :is-loading="isWaitingResponse" type="submit"
        >Reset password</AppButton
      >
    </form>
  </main>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppLabel from '@/components/common/AppLabel.vue'
import AppInputError from '@/components/common/AppInputError.vue'
import useForgotPassword from '@/components/auth/forgotPassword/forgot-password'

export default defineComponent({
  name: 'ForgotPassword',
  components: {
    AppInputError,
    AppButton,
    AppInput,
    AppLabel,
  },
  setup() {
    const { forgotPasswordForm, isWaitingResponse, isPasswordRecoverySend, submitForgotPassword } = useForgotPassword()

    const { email } = toRefs(forgotPasswordForm.fieldSet)

    return { forgotPasswordForm, email, isWaitingResponse, isPasswordRecoverySend, submitForgotPassword }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/auth/ForgotPassword';
</style>
