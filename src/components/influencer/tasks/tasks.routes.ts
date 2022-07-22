import { RouteRecordRaw } from 'vue-router'

export const tasksRoutes: Array<RouteRecordRaw> = [
  {
    path: 'tasks',
    name: 'Tasks',
    component: () => import('@/views/influencer/Tasks.vue'),
    meta: {
      requiresAuth: true,
      requiresInfluencer: true,
      title: 'Freelance Influence | My Tasks',
    },
  },
]
