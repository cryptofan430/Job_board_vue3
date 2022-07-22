import { RouteRecordRaw } from 'vue-router'

export const proposalsRoute: Array<RouteRecordRaw> = [
  {
    path: 'proposals',
    name: 'Proposals',
    component: () => import('@/views/influencer/Proposals.vue'),
    meta: {
      requiresAuth: true,
      requiresInfluencer: true,
    },
  },
]
