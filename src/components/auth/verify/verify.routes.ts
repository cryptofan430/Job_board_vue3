import { RouteRecordRaw } from 'vue-router'

export const verifyRoutes: Array<RouteRecordRaw> = [
  {
    path: '/verify/:token',
    name: 'Verify',
    component: () => import('@/views/auth/Verify.vue'),
    meta: {
      requiresAuth: false,
      requiresUnauth: false,
      useBlankHeader: true,
      infoHidden: true,
      useWhiteBackground: true,
      showBackButton: false,
      title: 'Freelance Influence | Email Verification',
    },
  },
]
