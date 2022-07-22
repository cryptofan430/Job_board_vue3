import { RouteRecordRaw } from 'vue-router'

export const notFoundRoutes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      requiresUnauth: false,
      requiresAuth: false,
      useBlankHeader: false,
      infoHidden: true,
      title: 'Freelance Influence | Page Not Found',
    },
  },
]
