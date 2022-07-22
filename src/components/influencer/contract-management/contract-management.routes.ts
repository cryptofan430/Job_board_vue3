import { RouteRecordRaw } from 'vue-router'

export const contractManagementRoutes: Array<RouteRecordRaw> = [
  {
    path: '/i/tasks/:taskId/contracts/:contractId/management',
    name: 'ContractManagement',
    component: () => import('@/views/influencer/ContractManagement.vue'),
    meta: {
      requiresAuth: true,
      requiresInfluencer: true,
    },
    children: [
      {
        path: 'review',
        name: 'ContactManagementReview',
        component: () => import('@/components/influencer/contract-management/ReviewPopup.vue'),
        meta: {
          requiresAuth: true,
          requiresInfluencer: true,
          isPopup: true,
          backRoute: 'MarketerTaskSingleContract',
          title: 'Freelance Influence | Review Marketer',
        },
      },
    ],
  },
]
