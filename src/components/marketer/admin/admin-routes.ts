import { RouteRecordRaw } from 'vue-router'

export const adminRoutes: Array<RouteRecordRaw> = [
  {
    name: 'AdminTicketPage',
    path: '/a/tickets',
    component: () => import('@/views/admin/TicketsPage.vue'),
    meta: {
      requiresUnauth: false,
      requiresAuth: true,
      requiresMarketer: false,
      requiresInfluencer: false,
    },
  },
  {
    name: 'AdminDisputesPage',
    path: '/a/disputes',
    component: () => import('@/views/admin/DisputesPage.vue'),
    meta: {
      requiresUnauth: false,
      requiresAuth: true,
      requiresMarketer: false,
      requiresInfluencer: false,
    },
  },
  {
    name: 'AdminSingleDisputePage',
    path: '/a/disputes/:id',
    component: () => import('@/views/admin/Dispute.vue'),
    meta: {
      requiresUnauth: false,
      requiresAuth: true,
      requiresMarketer: false,
      requiresInfluencer: false,
    },
  },
]
