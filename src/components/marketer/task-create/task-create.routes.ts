import { RouteRecordRaw } from 'vue-router'

export const createTaskRoutes: Array<RouteRecordRaw> = [
  {
    path: '/create-task',
    name: 'Create',
    component: () => import('@/views/marketer/TaskCreate.vue'),
    meta: {
      requiresUnauth: false,
      requiresAuth: true,
      requiresMarketer: true,
      requiresInfluencer: false,
      isNeededToScrollTop: true,
      title: 'Freelance Influence | Create Task',
    },
  },
]
