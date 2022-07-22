import { RouteRecordRaw } from 'vue-router'

export const maintenanceModeRoutes: Array<RouteRecordRaw> = [
  {
    path: '/maintenance-mode',
    name: 'MaintenanceMode',
    component: () => import('@/views/MaintenanceMode.vue'),
    meta: {
      requiresUnauth: false,
      requiresAuth: false,
      useBlankHeader: false,
      title: 'Freelance Influence | Maintenance',
    },
  },
]
