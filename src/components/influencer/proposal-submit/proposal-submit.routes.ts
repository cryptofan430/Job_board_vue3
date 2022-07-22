import { RouteRecordRaw } from 'vue-router'

export const proposalSubmitRoute: Array<RouteRecordRaw> = [
  {
    path: '/i/tasks/:taskId/propose',
    name: 'ProposalSubmit',
    component: () => import('@/views/influencer/ProposalSubmit.vue'),
    meta: {
      requiresAuth: true,
      requiresInfluencer: true,
      isNeededToScrollTop: true,
    },
  },
  {
    path: '/i/tasks/:taskId/proposal/edit',
    name: 'InfluencerProposalEdit',
    component: () => import('@/views/influencer/ProposalEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresInfluencer: true,
    },
  },
]
