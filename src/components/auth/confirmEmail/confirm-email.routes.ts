import { RouteRecordRaw } from 'vue-router'

export const confirmEmailRoutes: Array<RouteRecordRaw> = [
  {
    path: '/confirm-email',
    name: 'ConfirmEmail',
    component: () => import('@/views/auth/ConfirmEmail.vue'),
    meta: {
      requiresAuth: false,
      requiresUnauth: true,
      infoHidden: true,
      footerHidden: true,
      useBlankHeader: true,
      useWhiteBackground: true,
      showBackButton: false,
      title: 'Freelance Influence | Confirm Email',
    },
  },
]
