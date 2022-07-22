import { RouteRecordRaw } from 'vue-router'
import { tasksRoutes } from './tasks/tasks.routes'
import { tasksSearchRoutes } from './tasks-search/tasks-search.routes'
import { contractAcceptRoutes } from './contract-accept/contract-accept.routes'
import { profileRoutes } from './profile/profile.routes'
import { invitationsRoutes } from './invitations/invitations.routes'
import { proposalsRoute } from './proposals/proposals.routes'
import { contractsRoutes } from './contracts/contracts.routes'
import { contractManagementRoutes } from './contract-management/contract-management.routes'
import { proposalRoute } from './proposal/proposal.routes'
import { proposalSubmitRoute } from './proposal-submit/proposal-submit.routes'

export const influencerRoutes: Array<RouteRecordRaw> = [
  {
    path: '/i',
    name: 'influencer',
    component: () => import('@/views/influencer/Influencer.vue'),
    children: [
      ...tasksRoutes,
      ...tasksSearchRoutes,
      ...invitationsRoutes,
      ...proposalsRoute,
      ...contractsRoutes,
      ...profileRoutes,
      {
        path: '',
        component: () => import('@/views/NotFound.vue'),
      },
    ],
    meta: {
      requiresAuths: true,
      requiresInfluencer: true,
    },
  },
  ...contractManagementRoutes,
  ...contractAcceptRoutes,
  ...proposalRoute,
  ...proposalSubmitRoute,
]
