import { createFormFieldSet, createFormItem, useValidators } from '@/components/helpers/forms'
import { useStringPathParamReactive } from '@/components/helpers/route'
import useUserAuthentificationController from '@/middleware/controllers/useUserAuthentificationController'
import { errorMessagesToString, getFirstError } from '@/services/api'
import { PasswordResetError } from '@/types/user.model'
import { AxiosError } from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default function usePasswordRecovery() {
  const { changePassword } = useUserAuthentificationController()
  const { required, stringMinLength, stringMaxLength } = useValidators()
  const isRecoverySucceed = ref(false)
  const isWaitingResponse = ref(false)
  const router = useRouter()
  const token = useStringPathParamReactive('token')

  const createPasswordRecoveryForm = () => {
    const passwordValidators = [
      required,
      stringMinLength(6, () => 'Password should consist of at least 6 symbols'),
      stringMaxLength(2147483647, () => 'Password should consist at at most 2147483647 symbols'),
    ]

    const password = createFormItem('', { validators: passwordValidators })

    const passwordsEqualValidator = (confirmPasswordValue: string) => {
      if (password.getValue() !== confirmPasswordValue) {
        return 'Passwords should be equal'
      }
      return true
    }

    const confirmPasswordValidators = [...passwordValidators, passwordsEqualValidator]
    const confirmPassword = createFormItem('', {
      validators: confirmPasswordValidators,
    })

    return createFormFieldSet({
      password,
      confirmPassword,
      token: createFormItem(token.value),
    })
  }

  const passwordRecoveryForm = createPasswordRecoveryForm()

  const submitPasswordRecovery = () => {
    const isValid = passwordRecoveryForm.validate()

    if (isValid) {
      const passwordRecovery = passwordRecoveryForm.getValue()
      isWaitingResponse.value = true

      changePassword(passwordRecovery)
        .then(() => {
          isRecoverySucceed.value = true
          setTimeout(() => {
            router.push({ name: 'Login' })
          }, 3500)
        })
        .catch((e: AxiosError) => {
          const error = getFirstError<PasswordResetError>(e)
          if (error?.errorType === PasswordResetError.EMAIL_TOKEN_INVALID) {
            passwordRecoveryForm.setError("Please, check if link you're followed is valid and try again")
          } else if (error?.errorType === PasswordResetError.USER_NOT_EXIST) {
            passwordRecoveryForm.setError('User does not exist')
          } else {
            passwordRecoveryForm.setError(
              errorMessagesToString(e) || 'Unexpected error occurred please try again later'
            )
          }
        })
        .finally(() => {
          isWaitingResponse.value = false
        })
      // handle it when backend is done
    }
  }

  return { passwordRecoveryForm, isRecoverySucceed, isWaitingResponse, submitPasswordRecovery }
}
