import { RouteRecordRaw } from 'vue-router'

export const settingsRoutes: Array<RouteRecordRaw> = [
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/settings/Settings.vue'),
    redirect: {
      name: 'SettingsProfile',
    },
    meta: {
      requiresUnauth: false,
      requiresAuth: true,
      requiresMarketer: false,
      requiresInfluencer: false,
      isNeededToScrollTop: true,
      title: 'Freelance Influencer | Settings',
    },
    children: [
      {
        path: 'profile',
        name: 'SettingsProfile',
        component: () => import('@/views/settings/SettingsProfile.vue'),
        redirect: {
          name: 'SettingsMarketerProfile',
        },
        meta: {
          requiresUnauth: false,
          requiresAuth: true,
          requiresMarketer: false,
          requiresInfluencer: false,
          title: 'Freelance Influencer | My Profile',
        },
        children: [
          {
            path: 'marketer',
            name: 'SettingsMarketerProfile',
            component: () => import('@/components/settings/profile/MarketerProfile.vue'),
            meta: {
              title: 'Freelance Influence | Marketer Profile',
            },
          },
          {
            path: 'influencer',
            name: 'SettingsInfluencerProfile',
            component: () => import('@/components/settings/profile/InfluencerProfile.vue'),
            meta: {
              title: 'Freelance Influence | Influencer Profile',
            },
          },
        ],
      },
      {
        path: 'social-media',
        name: 'SettingsSocialMedia',
        component: () => import('@/views/settings/SettingsSocialMedia.vue'),
        meta: {
          requiresUnauth: false,
          requiresAuth: true,
          requiresMarketer: false,
          requiresInfluencer: false,
          title: 'Freelance Influencer | My Social Media',
        },
        children: [
          {
            path: 'twitch/add',
            name: 'AddTwitchAccountPopup',
            component: () => import('@/components/settings/popups/popups-social-settings/PopupAddTwitchAccount.vue'),
            meta: {
              backRoute: 'SettingsSocialMedia',
              isPopup: true,
              title: 'Freelance Influencer | Add Twitch Account',
            },
          },
          {
            path: 'instagram/add',
            name: 'AddInstagramAccountPopup',
            component: () => import('@/components/settings/popups/popups-social-settings/PopupAddInstagramAccount.vue'),
            meta: {
              backRoute: 'SettingsSocialMedia',
              isPopup: true,
              title: 'Freelance Influencer | Add Instagram Account',
            },
          },
          {
            path: 'youtube/add',
            name: 'AddYoutubeAccountPopup',
            component: () => import('@/components/settings/popups/popups-social-settings/PopupAddYoutubeAccount.vue'),
            meta: {
              backRoute: 'SettingsSocialMedia',
              isPopup: true,
              title: 'Freelance Influencer | Add Youtube Account',
            },
          },
          {
            path: 'tiktok/add',
            name: 'AddTikTokAccountPopup',
            component: () => import('@/components/settings/popups/popups-social-settings/PopupAddTicTokAccount.vue'),
            meta: {
              backRoute: 'SettingsSocialMedia',
              isPopup: true,
              title: 'Freelance Influencer | Add TikTok Account',
            },
          },
          {
            path: ':socialPlatform/:accountId/delete',
            name: 'DeleteSocialMediaAccount',
            component: () => import('@/components/settings/popups/popups-social-settings/PopupDeleteSocialAccount.vue'),
            meta: {
              backRoute: 'SettingsSocialMedia',
              isPopup: true,
            },
          },
          {
            path: ':socialPlatform/:accountId/edit',
            name: 'EditSocialMediaAccount',
            component: () => import('@/components/settings/popups/popups-social-settings/PopupEditSocialAccount.vue'),
            meta: {
              backRoute: 'SettingsSocialMedia',
              isPopup: true,
            },
          },
        ],
      },
      {
        path: 'payment',
        name: 'SettingsPayment',
        component: () => import('@/views/settings/SettingsPayment.vue'),
        meta: {
          requiresUnauth: false,
          requiresAuth: true,
          requiresMarketer: false,
          requiresInfluencer: false,
          title: 'Freelance Influence | Payment',
        },
        children: [
          {
            path: 'get-paid',
            name: 'GetPaidPopup',
            component: () => import('@/components/settings/popups/PopupGetPaid.vue'),
            meta: {
              backRoute: 'SettingsPayment',
              isPopup: true,
              title: 'Freelance Influence | Get Paid',
            },
          },
          {
            path: 'add-payment-method',
            name: 'AddPaymentMethodPopup',
            component: () => import('@/components/settings/popups/PopupAddPaymentMethod.vue'),
            meta: {
              backRoute: 'SettingsPayment',
              isPopup: true,
              title: 'Freelance Influence | Add Payment Method',
            },
          },
        ],
      },
      {
        path: 'billing',
        name: 'SettingsBilling',
        component: () => import('@/views/settings/SettingsBilling.vue'),
        meta: {
          requiresUnauth: false,
          requiresAuth: true,
          requiresMarketer: false,
          requiresInfluencer: false,
          title: 'Freelance Influence | Billing',
        },
        children: [
          {
            path: 'deposit-funds',
            name: 'DepositFundsPopup',
            component: () => import('@/components/settings/popups/PopupDepositFunds.vue'),
            meta: {
              backRoute: 'SettingsBilling',
              isPopup: true,
              title: 'Freelance Influence | Deposit Funds',
            },
          },
          {
            path: 'add-payment-method',
            name: 'AddPaymentMethodPopup2',
            component: () => import('@/components/settings/popups/PopupAddPaymentMethod.vue'),
            meta: {
              backRoute: 'SettingsBilling',
              isPopup: true,
              title: 'Freelance Influence | Add Payment Method',
            },
          },
        ],
      },
      {
        path: 'tax-info',
        name: 'SettingsTaxInfo',
        component: () => import('@/views/settings/SettingsTaxInfo.vue'),
        redirect: {
          name: 'SettingsMarketerTaxInfo',
        },
        meta: {
          requiresUnauth: false,
          requiresAuth: true,
          requiresMarketer: false,
          requiresInfluencer: false,
          title: 'Freelance Influence | Tax Info',
        },
        children: [
          {
            path: 'marketer',
            name: 'SettingsMarketerTaxInfo',
            component: () => import('@/components/settings/taxInfo/MarketerTaxInfo.vue'),
            meta: {
              title: 'Freelance Influence | Marketer Tax Info',
            },
          },
          {
            path: 'influencer',
            name: 'SettingsInfluencerTaxInfo',
            component: () => import('@/components/settings/taxInfo/InfluencerTaxInfo.vue'),
            meta: {
              title: 'Freelance Influence | Influencer Tax Info',
            },
          },
        ],
      },
      {
        path: 'transactions',
        name: 'SettingsTransactions',
        component: () => import('@/views/settings/SettingsTransactions.vue'),
        meta: {
          requiresUnauth: false,
          requiresAuth: true,
          requiresMarketer: false,
          requiresInfluencer: false,
          title: 'Freelance Influence | Transactions',
        },
      },
      {
        path: 'account',
        name: 'SettingsAccount',
        component: () => import('@/views/settings/SettingsAccount.vue'),
        meta: {
          requiresUnauth: false,
          requiresAuth: true,
          requiresMarketer: false,
          requiresInfluencer: false,
          title: 'Freelance Influence | My Account',
        },
        children: [
          {
            path: 'delete-account',
            name: 'SettingsDeleteAccountPopup',
            component: () => import('@/components/settings/popups/PopupDeleteAccount.vue'),
            meta: {
              backRoute: 'SettingsAccount',
              isPopup: true,
              title: 'Freelance Influence | Delete Account',
            },
          },
          {
            path: 'new-password',
            name: 'PopupNewPassword',
            component: () => import('@/components/settings/popups/PopupNewPassword.vue'),
            meta: {
              backRoute: 'SettingsAccount',
              isPopup: true,
              title: 'Freelance Influence | Change Password',
            },
          },
          {
            path: 'new-email',
            name: 'PopupNewEmail',
            component: () => import('@/components/settings/popups/PopupNewEmail.vue'),
            meta: {
              backRoute: 'SettingsAccount',
              isPopup: true,
              title: 'Freelance Influence | Change Email',
            },
          },
        ],
      },
      {
        path: 'help',
        name: 'SettingsHelp',
        component: () => import('@/views/settings/SettingsHelp.vue'),
        meta: {
          requiresUnauth: false,
          requiresAuth: true,
          requiresMarketer: false,
          requiresInfluencer: false,
          title: 'Freelance Influence | Help',
        },
      },
      {
        path: 'disputes',
        name: 'SettingsDisputes',
        component: () => import('@/views/settings/SettingsDisputes.vue'),
        redirect: {
          name: 'SettingsMarketerDisputes',
        },
        meta: {
          requiresUnauth: false,
          requiresAuth: true,
          requiresMarketer: false,
          requiresInfluencer: false,
          title: 'Freelance Influence | Disputes',
        },
        children: [
          {
            path: 'marketer',
            name: 'SettingsMarketerDisputes',
            component: () => import('@/components/settings/disputes/MarketerDisputes.vue'),
            meta: {
              title: 'Freelance Influence | Marketer Disputes',
            },
          },
          {
            path: 'influencer',
            name: 'SettingsInfluencerDisputes',
            component: () => import('@/components/settings/disputes/InfluencerDisputes.vue'),
            meta: {
              title: 'Freelance Influence | Influencer Disputes',
            },
          },
        ],
      },
    ],
  },
]
