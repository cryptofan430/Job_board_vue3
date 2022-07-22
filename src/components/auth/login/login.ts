import useUserAuthentificationController from '@/middleware/controllers/useUserAuthentificationController'
import { useRouter } from 'vue-router'
import { LoginError, UserToLogin } from '@/types/user.model'
import { createFormFieldSet, createFormItem, useValidators } from '@/components/helpers/forms'
import { AxiosError } from 'axios'
import { errorMessagesToString, getFirstError } from '@/services/api'

export default function useLogin() {
  const { required, emailValidator, stringMinLength, stringMaxLength, isBoolean } = useValidators()
  const auth = useUserAuthentificationController()
  const router = useRouter()

  const createUserForm = () => {
    const emailValidators = [required, emailValidator(() => 'Please input a valid email')]
    const passwordValidators = [
      required,
      stringMinLength(6, () => 'Password must consist of at least 6 symbols'),
      stringMaxLength(2147483647, () => 'Password must consist at at most 2147483647 symbols'),
    ]
    const rememberMeValidators = [required, isBoolean(() => 'Remember me field value is not the right type')]

    const email = createFormItem('', { validators: emailValidators })
    const password = createFormItem('', { validators: passwordValidators })
    const rememberMe = createFormItem(false, {
      validators: rememberMeValidators,
    })

    return createFormFieldSet({
      email,
      password,
      rememberMe,
    })
  }

  const userForm = createUserForm()

  const login = () => {
    const isValid = userForm.validate()

    if (isValid) {
      const user: UserToLogin = userForm.getValue()

      auth
        .login(user)
        .then(() => {
          router.push('/select-account-type')
        })
        .catch((e: AxiosError) => {
          const error = getFirstError<LoginError>(e)
          if (error?.errorType === LoginError.WRONG_CREDENTIALS) {
            userForm.setError('Please check if the email and password are correct and try again')
          } else if (error?.errorType === LoginError.VERIFICATION_PENDING) {
            userForm.setError('Please verify your account')
          } else {
            const errorMessage = errorMessagesToString(e)
            userForm.setError(errorMessage)
          }
        })

      return
    }
  }

  return {
    userForm,
    login,
  }
}
