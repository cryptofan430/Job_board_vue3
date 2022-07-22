import useUserAuthentificationController from '@/middleware/controllers/useUserAuthentificationController'
import { useRouter } from 'vue-router'
import { RegistrationError, UserToRegister } from '@/types/user.model'
import { createFormFieldSet, createFormItem, useValidators } from '@/components/helpers/forms'
import { getFirstError } from '@/services/api'
import { AxiosError } from 'axios'

export default function useRegister() {
  const router = useRouter()
  const auth = useUserAuthentificationController()
  const { required, emailValidator, stringMinLength, stringMaxLength } = useValidators()

  const createUserForm = () => {
    const emailValidators = [required, emailValidator(() => 'Please input a valid email')]
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

    const email = createFormItem('', { validators: emailValidators })
    const firstName = createFormItem('', { validators: [required] })
    const lastName = createFormItem('', { validators: [required] })
    const confirmPassword = createFormItem('', {
      validators: confirmPasswordValidators,
    })

    return createFormFieldSet({
      email,
      firstName,
      password,
      lastName,
      confirmPassword,
    })
  }

  const userForm = createUserForm()

  const register = () => {
    const isValid = userForm.validate()
    if (isValid) {
      const user: UserToRegister = userForm.getValue()

      auth
        .register(user)
        .then(() => {
          router.push('/confirm-email')
        })
        .catch((e: AxiosError) => {
          const error = getFirstError<RegistrationError>(e)
          if (error?.errorType === RegistrationError.EMAIL_ADDRESS_ALREADY_REGISTERED) {
            userForm.setError('A user with this email is already registered')
          } else {
            userForm.setError('An unexpected error occurred please try later')
          }
        })
    }
  }

  return {
    userForm,
    register,
  }
}
