import { RouteRecordRaw } from 'vue-router'

export const chatRoutes: Array<RouteRecordRaw> = [
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('@/views/Chat.vue'),
    meta: {
      requiresAuth: true,
      infoHidden: true,
    },
    children: [
      {
        path: '',
        name: 'EmptyChat',
        component: () => import('@/components/chat/content/EmptyChat.vue'),
        meta: {
          title: 'Freelance Influence | Chat',
        },
      },
      {
        path: ':chatId',
        name: 'SelectedChat',
        component: () => import('@/components/chat/content/ChatWindow.vue'),
        meta: {
          isChatDialog: true,
        },
        children: [
          {
            path: 'archivate',
            name: 'PopupArchivateChat',
            component: () => import('@/components/settings/popups/PopupArchivationMethod.vue'),
            meta: {
              backRoute: 'SelectedChat',
              isPopup: true,
              isChatDialog: true,
            },
          },
        ],
      },
    ],
  },
]
