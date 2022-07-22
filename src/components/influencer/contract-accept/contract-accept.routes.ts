import { RouteRecordRaw } from 'vue-router'

export const contractAcceptRoutes: Array<RouteRecordRaw> = [
  {
    path: '/i/tasks/:taskId/contracts/:contractId',
    name: 'ContractAccept',
    component: () => import('@/views/influencer/ContractAccept.vue'),
    meta: {
      requiresAuth: true,
      requiresInfluencer: true,
    },
  },
]
