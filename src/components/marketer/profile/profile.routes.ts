import { RouteRecordRaw } from 'vue-router'

export const profileRoutes: Array<RouteRecordRaw> = [
  {
    path: '/m/profile/:userId',
    name: 'MarketerProfile',
    component: () => import('@/views/marketer/Profile.vue'),
    meta: {
      requiresAuth: true,
      requiresUnauth: false,
      requiresInfluencer: false,
      requiresMarketer: true,
    },
  },
]
