<template>
  <main class="login">
    <h1 class="title">Log in</h1>
    <p class="welcome-message">It's great to see you back!</p>

    <form class="form" @submit.prevent="login">
      <AppInputError v-if="userForm.isError" class="form-error-message">
        {{ userForm.getErrorMessage }}
      </AppInputError>

      <div class="email-container">
        <AppLabel layout="responsive" for="email">Email</AppLabel>
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

      <div class="password-container">
        <div class="password-text">
          <AppLabel layout="responsive" for="password">Password</AppLabel>
          <router-link v-slot="{ href, navigate }" to="/forgot-password" custom>
            <a
              ref="forgotPasswordEl"
              class="forgot-password"
              tabindex="-1"
              :href="href"
              @click="navigate"
              @keydown.exact.tab.prevent="focusRegister"
              @keydown.shift.tab.prevent="focusLoginButton"
            >
              Forgot password?
            </a>
          </router-link>
        </div>

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

        <AppInputError v-if="password.isError">{{ password.getErrorMessage }}</AppInputError>
      </div>

      <div class="remember-me-container">
        <AppCheckbox id="remember" v-model="rememberMe.value" />
        <AppLabel for="remember" size="sm">Remember me</AppLabel>
      </div>

      <AppButton ref="loginButtonEl" type="submit" class="login-button" @keydown.exact.tab.prevent="focusForgotPasword"
        >Log in</AppButton
      >
    </form>

    <div class="register-info">
      <span class="register-text">Don't have an account?</span>
      <router-link v-slot="{ navigate, href }" to="/register" tabindex="0" custom>
        <a
          ref="registerEl"
          class="register-link"
          :href="href"
          @click="navigate"
          @keydown.shift.tab.prevent="focusForgotPasword"
        >
          Register
        </a>
      </router-link>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppLabel from '@/components/common/AppLabel.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import AppCheckbox from '@/components/common/AppCheckbox.vue'
import useLogin from '@/components/auth/login/login'
import AppInputError from '@/components/common/AppInputError.vue'

export default defineComponent({
  name: 'Login',
  components: {
    AppButton,
    AppInput,
    AppIcon,
    AppLabel,
    AppCheckbox,
    AppInputError,
  },
  setup() {
    const forgotPasswordEl = ref<HTMLElement | null>(null)
    const registerEl = ref<HTMLElement | null>(null)
    const loginButtonEl = ref<typeof AppButton | null>(null)

    const isPasswordVisible = ref(false)
    const togglePasswordVisibility = () => {
      isPasswordVisible.value = !isPasswordVisible.value
    }

    const focusForgotPasword = () => {
      forgotPasswordEl.value?.focus()
    }
    const focusRegister = () => {
      registerEl.value?.focus()
    }
    const focusLoginButton = () => {
      loginButtonEl.value?.focusEl()
    }

    const { userForm, login } = useLogin()

    const { email, password, rememberMe } = toRefs(userForm.fieldSet)

    return {
      userForm,
      forgotPasswordEl,
      loginButtonEl,
      registerEl,
      email,
      password,
      rememberMe,
      isPasswordVisible,
      togglePasswordVisibility,
      login,
      focusForgotPasword,
      focusRegister,
      focusLoginButton,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/auth/Login';
</style>
