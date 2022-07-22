import { createFormFieldSet, createFormItem, useValidators } from '@/components/helpers/forms'
import useUserAuthentificationController from '@/middleware/controllers/useUserAuthentificationController'
import { errorMessagesToString, getFirstError } from '@/services/api'
import { PasswordResetRequestError } from '@/types/user.model'
import { AxiosError } from 'axios'
import { ref } from 'vue'

export default function useForgotPassword() {
  const { resetPassword } = useUserAuthentificationController()
  const { required, emailValidator } = useValidators()

  const isPasswordRecoverySend = ref(false)
  const isWaitingResponse = ref(false)

  const createForgotPasswordForm = () => {
    const email = createFormItem('', {
      validators: [required, emailValidator(() => 'Please input a valid email')],
    })

    return createFormFieldSet({
      email,
    })
  }

  const forgotPasswordForm = createForgotPasswordForm()

  const submitForgotPassword = () => {
    const isValid = forgotPasswordForm.validate()

    if (isValid) {
      const forgotPassword = forgotPasswordForm.getValue()
      isWaitingResponse.value = true

      resetPassword(forgotPassword.email)
        .then(() => {
          isPasswordRecoverySend.value = true
        })
        .catch((e: AxiosError) => {
          const error = getFirstError<PasswordResetRequestError>(e)
          if (error?.errorType === PasswordResetRequestError.EMAIL_ADDRESS_NOT_REGISTERED) {
            forgotPasswordForm.setError('User with this email is not registered')
          } else {
            forgotPasswordForm.setError(errorMessagesToString(e) || 'Unexpected error occurred. Please try later')
          }
        })
        .finally(() => {
          isWaitingResponse.value = false
        })
    }
  }

  return {
    forgotPasswordForm,
    isWaitingResponse,
    isPasswordRecoverySend,
    submitForgotPassword,
  }
}
