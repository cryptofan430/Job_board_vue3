import { RouteRecordRaw } from 'vue-router'

export const selectAccountTypeRoutes: Array<RouteRecordRaw> = [
  {
    path: '/select-account-type',
    name: 'SelectAccountType',
    component: () => import('@/views/auth/SelectAccountType.vue'),
    meta: {
      requiresAuth: true,
      requiresUnauth: false,
      requiresMarketer: false,
      requiresInfluencer: false,
      footerHidden: true,
      useBlankHeader: true,
      useWhiteBackground: true,
      showBackButton: false,
      infoHidden: true,
      title: 'Freelance Influence | Select Account Type',
    },
  },
]
