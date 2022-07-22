import { RouteRecordRaw } from 'vue-router'

export const registerRoutes: Array<RouteRecordRaw> = [
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue'),
    meta: {
      requiresAuth: false,
      requiresUnauth: true,
      useBlankHeader: true,
      infoHidden: true,
      useWhiteBackground: true,
      showBackButton: true,
      isNeededToScrollTop: true,
      title: 'Freelance Influence | Register',
    },
  },
]
