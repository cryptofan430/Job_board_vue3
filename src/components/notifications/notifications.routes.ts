import { RouteRecordRaw } from 'vue-router'

export const notificationRoutes: Array<RouteRecordRaw> = [
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('@/views/Notifications.vue'),
    meta: {
      requiresUnauth: false,
      requiresAuth: true,
      requiresMarketer: false,
      requiresInfluencer: false,
      title: 'Freelance Influence | Notifications',
    },
  },
]
