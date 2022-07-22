import { RouteRecordRaw } from 'vue-router'

export const invitationsRoutes: Array<RouteRecordRaw> = [
  {
    path: 'invitations',
    name: 'Invitations',
    component: () => import('@/views/influencer/Invitations.vue'),
    meta: {
      requiresAuth: true,
      requiresInfluencer: true,
      title: 'Freelance Influence | Invitations',
    },
  },
]
