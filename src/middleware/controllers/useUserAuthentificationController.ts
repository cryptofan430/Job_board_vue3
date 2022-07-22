import api from '@/services/api'
import useUserStore from '@/store/user'
import { ResetPasswordRequest, UserResponseWithJWT, UserToLogin, UserToRegister } from '@/types/user.model'
import useAuthStore from '@/store/auth'

const { setMyProfile } = useUserStore()
const auth = useAuthStore()

const login = async (user: UserToLogin) => {
  return await api.post<UserResponseWithJWT>('users/auth', user).then((response) => {
    auth.isAuthenticated.value = true
    setMyProfile(response.data.user)
    return response
  })
}

const logout = async () => {
  return await api.post<Record<string, never>>('users/auth/logout').finally(() => {
    auth.reset()
  })
}

const register = async (user: UserToRegister) => {
  return await api.put<Record<string, never>>('users/auth', user)
}

const resetPassword = async (email: string) => {
  return await api.post<Record<string, never>>(`/users/auth/reset-password-request/?email=${email}`, {})
}

const changePassword = async (data: ResetPasswordRequest) => {
  return await api.post<Record<string, never>>('/users/auth/reset-password/', data)
}

export default function useUserAuthentificationController() {
  return {
    login,
    logout,
    register,
    resetPassword,
    changePassword,
  }
}
