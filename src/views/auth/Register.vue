<template>
  <main class="register">
    <h1 class="title">Register</h1>

    <form class="form" @submit.prevent="register">
      <AppInputError v-if="userForm.isError" class="form-error-message">
        {{ userForm.getErrorMessage }}
      </AppInputError>

      <div class="first-name-container">
        <AppLabel layout="responsive" for="first-name">First Name</AppLabel>
        <AppInput
          id="first-name"
          v-model="firstName.value"
          name="first-name"
          :error="firstName.isError"
          responsive="true"
          @update:modelValue="firstName.setNormalState"
        />
        <AppInputError v-if="firstName.isError">{{ firstName.getErrorMessage }}</AppInputError>
      </div>

      <div class="last-name-container">
        <AppLabel layout="responsive" for="last-name">Last Name</AppLabel>
        <AppInput
          id="last-name"
          v-model="lastName.value"
          name="last-name"
          :error="lastName.isError"
          responsive="true"
          @update:modelValue="lastName.setNormalState"
        />
        <AppInputError v-if="lastName.isError">{{ lastName.getErrorMessage }}</AppInputError>
      </div>

      <div class="email-container">
        <AppLabel layout="responsive" for="email">Email</AppLabel>
        <AppInput
          id="email"
          v-model="email.value"
          name="email"
          :error="email.isError"
          responsive="true"
          @update:modelValue="email.setNormalState"
        />
        <AppInputError v-if="email.isError">{{ email.getErrorMessage }}</AppInputError>
      </div>

      <div class="password-container">
        <AppLabel layout="responsive" for="password">Password</AppLabel>

        <div class="password-input-container">
          <AppInput
            id="password"
            v-model="password.value"
            name="password"
            :type="isPasswordVisible ? 'text' : 'password'"
            :error="password.isError"
            responsive="true"
            @update:modelValue="password.setNormalState"
          />

          <button class="show-password-button" type="button" @click.prevent="togglePasswordVisibility">
            <AppIcon name="pass" :pass-visible="isPasswordVisible" />
          </button>
        </div>

        <AppInputError v-if="password.isError">{{ password.getErrorMessage }}</AppInputError>

        <span class="password-length-info">Password should contain at least 6 characters</span>
      </div>

      <div class="password-container">
        <AppLabel layout="responsive" for="confirm-password">Confirm Password</AppLabel>

        <div class="password-input-container">
          <AppInput
            id="confirm-password"
            v-model="confirmPassword.value"
            name="confirm-password"
            :type="isConfirmPasswordVisible ? 'text' : 'password'"
            :error="confirmPassword.isError"
            responsive="true"
            @update:modelValue="confirmPassword.setNormalState"
          />

          <button class="show-password-button" type="button" @click.prevent="toggleConfirmPasswordVisibility">
            <AppIcon name="pass" :pass-visible="isConfirmPasswordVisible" />
          </button>
        </div>

        <AppInputError v-if="confirmPassword.isError">{{ confirmPassword.getErrorMessage }}</AppInputError>
      </div>

      <div class="register-consents">
        <span class="consent-text">
          By registering you agree to

          <router-link v-slot="{ navigate, href }" to="/terms-of-use" tabindex="-1" custom>
            <a
              ref="termsOfUseEl"
              class="link"
              :href="href"
              @click="navigate"
              @keydown.shift.tab.prevent="focusRegisterButton"
              @keydown.exact.tab.prevent="focusPrivacyPolicy"
            >
              Terms of Use
            </a>
          </router-link>
          and
          <router-link v-slot="{ navigate, href }" class="link" to="/privacy-policy" tabindex="-1" custom>
            <a
              ref="privacyPolicyEl"
              class="link"
              :href="href"
              @click="navigate"
              @keydown.shift.tab.prevent="focusTermsOfUse"
              @keydown.exact.tab.prevent="focusFooterPrivacyPolicy"
            >
              Privacy Policy
            </a>
          </router-link>
        </span>
      </div>

      <AppButton
        ref="registerButtonEl"
        type="submit"
        class="register-button"
        @keydown.exact.tab.prevent="focusTermsOfUse"
        >Register</AppButton
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
import useRegister from '@/components/auth/register/register'
import AppInputError from '@/components/common/AppInputError.vue'

export default defineComponent({
  name: 'Register',
  components: {
    AppButton,
    AppInput,
    AppIcon,
    AppLabel,
    AppInputError,
  },
  setup() {
    const termsOfUseEl = ref<HTMLElement | null>(null)
    const registerButtonEl = ref<typeof AppButton | null>(null)
    const privacyPolicyEl = ref<HTMLElement | null>(null)

    const isPasswordVisible = ref(false)
    const isConfirmPasswordVisible = ref(false)

    const togglePasswordVisibility = () => {
      isPasswordVisible.value = !isPasswordVisible.value
    }
    const toggleConfirmPasswordVisibility = () => {
      isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value
    }
    const focusFooterPrivacyPolicy = () => {
      const el: HTMLElement | null = document.getElementById('footer-first-focusable')
      el?.focus()
    }

    const focusTermsOfUse = () => {
      termsOfUseEl.value?.focus()
    }
    const focusPrivacyPolicy = () => {
      privacyPolicyEl.value?.focus()
    }
    const focusRegisterButton = () => {
      registerButtonEl.value?.focusEl()
    }

    const { register, userForm } = useRegister()

    const { email, lastName, password, firstName, confirmPassword } = toRefs(userForm.fieldSet)

    return {
      registerButtonEl,
      privacyPolicyEl,
      termsOfUseEl,
      userForm,
      email,
      lastName,
      password,
      firstName,
      confirmPassword,
      isPasswordVisible,
      isConfirmPasswordVisible,
      togglePasswordVisibility,
      toggleConfirmPasswordVisibility,
      focusRegisterButton,
      focusPrivacyPolicy,
      focusTermsOfUse,
      register,
      focusFooterPrivacyPolicy,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/auth/Register';
</style>
