import { RouteRecordRaw } from 'vue-router'

export const dashboardRoutes: Array<RouteRecordRaw> = [
  {
    path: '/m/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/marketer/dashboard/Dashboard.vue'),
    meta: {
      requiresUnauth: false,
      requiresAuth: true,
      requiresMarketer: true,
      requiresInfluencer: false,
      isNeededToScrollTop: true,
      title: 'Freelance Influence | Marketer Dashboard',
    },
    children: [
      {
        path: '',
        name: 'DashboardView',
        component: () => import('@/views/marketer/dashboard/DashboardView.vue'),
        meta: {
          requiresUnauth: false,
          requiresAuth: true,
          requiresMarketer: true,
          requiresInfluencer: false,
          title: 'Freelance Influence | Marketer Dashboard',
        },
      },
      {
        path: 'tasks',
        component: () => import('@/views/marketer/dashboard/AllTasks.vue'),
        meta: {
          requiresUnauth: false,
          requiresAuth: true,
          requiresMarketer: true,
          requiresInfluencer: false,
          title: 'Freelance Influence | My Tasks',
        },
      },
      {
        path: 'contracts',
        component: () => import('@/views/marketer/dashboard/AllContracts.vue'),
        meta: {
          requiresUnauth: false,
          requiresAuth: true,
          requiresMarketer: true,
          requiresInfluencer: false,
          title: 'Freelance Influence | My Contracts',
        },
      },
    ],
  },
]
