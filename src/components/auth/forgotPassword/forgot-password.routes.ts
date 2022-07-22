import { RouteRecordRaw } from 'vue-router'

export const forgotPasswordRoutes: Array<RouteRecordRaw> = [
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/auth/ForgotPassword.vue'),
    meta: {
      requiresAuth: false,
      requiresUnauth: true,
      useBlankHeader: true,
      infoHidden: true,
      useWhiteBackground: true,
      showBackToLoginButton: true,
      title: 'Freelance Influence | Forgot Password',
    },
  },
]
