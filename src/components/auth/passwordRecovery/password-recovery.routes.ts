import { RouteRecordRaw } from 'vue-router'

export const passwordRecoveryRoutes: Array<RouteRecordRaw> = [
  {
    path: '/password-recovery/:token',
    name: 'PasswordRecovery',
    component: () => import('@/views/auth/PasswordRecovery.vue'),
    meta: {
      requiresAuth: false,
      requiresUnauth: true,
      useBlankHeader: true,
      useWhiteBackground: true,
      infoHidden: true,
      showBackButton: false,
      title: 'Freelance Influence | Password Recover',
    },
  },
]
