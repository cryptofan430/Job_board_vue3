import { RouteRecordRaw } from 'vue-router'

export const contractsRoutes: Array<RouteRecordRaw> = [
  {
    path: 'contracts',
    name: 'Contracts',
    component: () => import('@/views/influencer/Contracts.vue'),
    meta: {
      requiresAuth: true,
      requiresInfluencer: true,
    },
  },
]
