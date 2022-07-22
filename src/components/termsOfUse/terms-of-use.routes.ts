import { RouteRecordRaw } from 'vue-router'

export const termsOfUseRoutes: Array<RouteRecordRaw> = [
  {
    path: '/terms-of-use',
    name: 'TermsOfUse',
    component: () => import('@/views/TermsOfUse.vue'),
    meta: {
      requiresAuth: false,
      useBlankHeader: false,
      isNeededToScrollTop: true,
      title: 'Freelance Influence | Terms Of Use',
    },
  },
]
