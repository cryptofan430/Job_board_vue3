<template>
  <main class="verify">
    <template v-if="!verificationEnded">
      <p class="base-info">Your email is being verified.</p>
      <p class="additional-info">Please, wait for a few seconds...</p>
      <AppCompletionProgress :percent="20" />
    </template>

    <template v-else-if="verificationEnded && success">
      <p class="base-info --success">Verification succeed!</p>
      <p class="additional-info">You’ll be directed to next page automatically.</p>
    </template>

    <template v-else>
      <p class="base-info --error">Verification failed!</p>
      <p class="additional-info">{{ verificationErrorMessage }}</p>
      <AppLink to="/" responsive>Go to main page</AppLink>
    </template>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppCompletionProgress from '@/components/common/AppCompletionProgress.vue'
import AppLink from '@/components/common/AppLink.vue'
import useUserManagementController from '@/middleware/controllers/useUserManagementController'
import { AxiosError } from 'axios'
import { getFirstError } from '@/services/api'
import { VerificationError } from '@/types/user.model'

export default defineComponent({
  name: 'Verify',
  components: {
    AppCompletionProgress,
    AppLink,
  },
  setup() {
    const { verifyEmail } = useUserManagementController()
    const router = useRouter()
    const token = router.currentRoute.value.params.token as string
    const verificationEnded = ref(false)
    const verificationErrorMessage = ref<null | string>(null)
    const success = ref(false)

    if (token) {
      verifyEmail(token)
        .then(() => {
          success.value = true

          setTimeout(() => {
            router.push('/login')
          }, 3500)
        })
        .catch((e: AxiosError) => {
          success.value = false

          const error = getFirstError<VerificationError>(e)
          if (error?.errorType === VerificationError.USER_NOT_EXIST) {
            verificationErrorMessage.value = `Something went wrong. User that you're trying to verify does not exist`
          } else if (error?.errorType === VerificationError.EMAIL_VERIFIED_ALREADY) {
            verificationErrorMessage.value = `Email is already verified`
          } else {
            verificationErrorMessage.value = `Something went wrong. Make sure you've used proper verification link from email`
          }
        })
        .finally(() => {
          verificationEnded.value = true
        })
    }

    return {
      verificationEnded,
      verificationErrorMessage,
      success,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/views/auth/Verify';
</style>
