import { RouteRecordRaw } from 'vue-router'

export const loginRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: {
      requiresAuth: false,
      requiresUnauth: true,
      useBlankHeader: true,
      useWhiteBackground: true,
      showBackButton: true,
      infoHidden: true,
      title: 'Freelance Influence | Login',
    },
  },
]
