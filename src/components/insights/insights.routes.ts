import { RouteRecordRaw } from 'vue-router'

export const insightsRoute: Array<RouteRecordRaw> = [
  {
    path: '/insights/instagram/:id',
    name: 'InstagramInsights',
    component: () => import('@/views/insights/InstagramInsights.vue'),
    meta: {
      requiresAuth: true,
      requiresInfluencer: false,
      title: 'Freelance Influence | Instagram Insights',
    },
  },
  {
    path: '/insights/youtube/:id',
    name: 'YoutubeInsights',
    component: () => import('@/views/insights/YoutubeInsights.vue'),
    meta: {
      requiresAuth: true,
      requiresInfluencer: false,
      title: 'Freelance Influence | Youtube Insights',
    },
  },
]
