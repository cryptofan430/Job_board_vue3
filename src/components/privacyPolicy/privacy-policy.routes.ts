import { RouteRecordRaw } from 'vue-router'

export const privacyPolicyRoutes: Array<RouteRecordRaw> = [
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: () => import('@/views/PrivacyPolicy.vue'),
    meta: {
      requiresAuth: false,
      useBlankHeader: false,
      isNeededToScrollTop: true,
      title: 'Freelance Influence | Privacy Policy',
    },
  },
]
