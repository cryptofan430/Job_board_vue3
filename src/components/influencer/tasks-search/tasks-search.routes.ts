import { RouteRecordRaw } from 'vue-router'

export const tasksSearchRoutes: Array<RouteRecordRaw> = [
  {
    path: 'tasks/search',
    name: 'TasksSearch',
    component: () => import('@/views/influencer/TasksSearch.vue'),
    meta: {
      requiresAuth: true,
      requiresInfluencer: true,
      title: 'Freelance Influence | Search For Tasks',
    },
  },
]
