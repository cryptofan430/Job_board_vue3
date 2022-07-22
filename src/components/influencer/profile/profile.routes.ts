import { RouteRecordRaw } from 'vue-router'

export const profileRoutes: Array<RouteRecordRaw> = [
  {
    path: 'profile/:userId',
    name: 'Profile',
    component: () => import('@/views/influencer/Profile.vue'),
    meta: {
      requiresAuth: true,
      requiresInfluencer: true,
    },
  },
]
