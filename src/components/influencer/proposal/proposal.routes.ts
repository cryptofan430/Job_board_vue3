import { RouteRecordRaw } from 'vue-router'

export const proposalRoute: Array<RouteRecordRaw> = [
  {
    path: '/i/tasks/:taskId/proposal',
    name: 'Proposal',
    component: () => import('@/views/influencer/Proposal.vue'),
    meta: {
      requiresAuth: true,
      requiresInfluencer: true,
      isNeededToScrollTop: true,
    },
    children: [
      {
        path: 'withdraw',
        name: 'WithdrawProposalPopup',
        component: () => import('@/components/influencer/proposal/WIthdrawProposalPopup.vue'),
        meta: {
          isPopup: true,
          backRoute: 'Proposal',
          title: 'Freelance Influence | Withdraw Proposal',
        },
      },
    ],
  },
]
