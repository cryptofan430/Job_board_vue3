import { RouteRecordRaw } from 'vue-router'

export const homepageRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Homepage',
    component: () => import('@/views/Homepage.vue'),
    meta: {
      requiresAuth: false,
      requiresUnauth: true,
      useBlankHeader: false,
      infoHidden: true,
      title: 'Freelance Influence',
    },
  },
]
