import { RouteRecordRaw } from 'vue-router'

export const taskRoutes: Array<RouteRecordRaw> = [
  {
    path: '/m/tasks/:taskId',
    name: 'MarketerTask',
    component: () => import('@/views/marketer/task/Task.vue'),
    meta: {
      requiresUnauth: false,
      requiresAuth: true,
      requiresMarketer: true,
      requiresInfluencer: false,
      isNeededToScrollTop: true,
    },
    children: [
      {
        path: '',
        name: 'MarketerTaskDetails',
        component: () => import('@/views/marketer/task/TaskDetails.vue'),
        meta: {
          requiresUnauth: false,
          requiresAuth: true,
          requiresMarketer: true,
          requiresInfluencer: false,
        },
      },
      {
        path: 'contracts',
        component: () => import('@/views/marketer/task/TaskContracts.vue'),
        meta: {
          requiresUnauth: false,
          requiresAuth: true,
          requiresMarketer: true,
          requiresInfluencer: false,
        },
      },
      {
        path: 'proposals',
        component: () => import('@/views/marketer/task/TaskProposals.vue'),
        meta: {
          requiresUnauth: false,
          requiresAuth: true,
          requiresMarketer: true,
          requiresInfluencer: false,
        },
      },
      {
        path: 'invitations',
        component: () => import('@/views/marketer/task/TaskInvitations.vue'),
        meta: {
          requiresUnauth: false,
          requiresAuth: true,
          requiresMarketer: true,
          requiresInfluencer: false,
        },
      },
    ],
  },
  {
    path: '/m/tasks/:taskId/contracts/:contractId',
    name: 'MarketerTaskSingleContract',
    component: () => import('@/views/marketer/task/TaskContract.vue'),
    meta: {
      requiresUnauth: false,
      requiresAuth: true,
      requiresMarketer: true,
      requiresInfluencer: false,
    },
    children: [
      {
        path: 'end-contract',
        name: 'MarketerTaskSingleContractSubmitEnd',
        component: () => import('@/components/marketer/task/task-contract/SubmitContractEndPopup.vue'),
        meta: {
          isPopup: true,
          backRoute: 'MarketerTaskSingleContract',
        },
      },
      {
        path: 'review',
        name: 'MarketerTaskReviewInfluencer',
        component: () => import('@/components/marketer/task/task-contract/ReviewPopup.vue'),
        meta: {
          isPopup: true,
          backRoute: 'MarketerTaskSingleContract',
        },
      },
    ],
  },
  {
    path: '/m/tasks/:taskId/proposals/:proposalId/create-contract',
    name: 'CreateContract',
    component: () => import('@/views/marketer/task/CreateContract.vue'),
    meta: {
      requiresUnauth: false,
      requiresAuth: true,
      requiresMarketer: true,
      requiresInfluencer: false,
    },
  },
  {
    path: '/m/tasks/:taskId/contracts/:contractId/add-milestones',
    name: 'AddMilestones',
    component: () => import('@/views/marketer/task/AddMilestones.vue'),
    meta: {
      requiresUnauth: false,
      requiresAuth: true,
      requiresMarketer: true,
      requiresInfluencer: false,
    },
  },
  {
    path: '/m/tasks/:taskId/edit-task',
    name: 'EditTask',
    component: () => import('@/views/marketer/task/EditTask.vue'),
    meta: {
      requiresUnauth: false,
      requiresAuth: true,
      requiresMarketer: true,
      requiresInfluencer: false,
    },
  },
]
