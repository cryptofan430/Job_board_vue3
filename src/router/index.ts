import useAuthStore from '@/store/auth'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { registerRoutes } from '@/components/auth/register/register.routes'
import { loginRoutes } from '@/components/auth/login/login.routes'
import { forgotPasswordRoutes } from '@/components/auth/forgotPassword/forgot-password.routes'
import { passwordRecoveryRoutes } from '@/components/auth/passwordRecovery/password-recovery.routes'
import { verifyRoutes } from '@/components/auth/verify/verify.routes'
import { confirmEmailRoutes } from '@/components/auth/confirmEmail/confirm-email.routes'
import { selectAccountTypeRoutes } from '@/components/auth/selectAccountType/select-account-type.routes'
import { homepageRoutes } from '@/components/hompepage/homepage.routes'
import { notFoundRoutes } from '@/components/notFound/not-found.routes'
import { maintenanceModeRoutes } from '@/components/maintenanceMode/maintenance-mode.routes'
import { privacyPolicyRoutes } from '@/components/privacyPolicy/privacy-policy.routes'
import { termsOfUseRoutes } from '@/components/termsOfUse/terms-of-use.routes'
import { marketerRoutes } from '@/components/marketer/marketer.routes'
import { influencerRoutes } from '@/components/influencer/influencer.routes'
import { notificationRoutes } from '@/components/notifications/notifications.routes'
import { settingsRoutes } from '@/components/settings/settings.routes'
import { chatRoutes } from '@/components/chat/chat-routes'
import { insightsRoute } from '@/components/insights/insights.routes'
import { setTitle, scrollToPageTop } from '@/components/helpers/dom'

const routes: Array<RouteRecordRaw> = [
  ...homepageRoutes,
  ...loginRoutes,
  ...registerRoutes,
  ...confirmEmailRoutes,
  ...verifyRoutes,
  ...selectAccountTypeRoutes,
  ...forgotPasswordRoutes,
  ...passwordRecoveryRoutes,
  ...privacyPolicyRoutes,
  ...termsOfUseRoutes,
  ...notificationRoutes,
  ...marketerRoutes,
  ...influencerRoutes,
  ...settingsRoutes,
  ...insightsRoute,
  ...chatRoutes,
  ...notFoundRoutes,
  ...maintenanceModeRoutes,
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  // This scrollBehavoir is for moving user to top of page when route changes,
  // probably some field will have to be added to meta in all routes to determine
  // if on current route user has to be moved to top of page or not
  // scrollBehavior: () => { return { top: 0 } }
})

const { isAuthenticated, accountType } = useAuthStore()

router.beforeEach((to, _, next) => {
  if (to.meta.isNeededToScrollTop) {
    scrollToPageTop()
  }

  if (to.meta.title) {
    setTitle(to.meta.title as string)
  }

  if (isAuthenticated.value && !accountType.value && to.name !== 'SelectAccountType' && to.name !== 'Verify') {
    next({ name: 'SelectAccountType' })
    return
  }

  if (to.meta.requiresAuth && !to.meta.requiresUnauth) {
    if (!isAuthenticated.value) {
      next({ name: 'Login' })
      return
    }

    if (to.meta.requiresInfluencer) {
      accountType.value = 'influencer'
      next()
      return
    }

    if (to.meta.requiresMarketer) {
      accountType.value = 'marketer'
      next()
      return
    }
  }

  if (to.meta.requiresUnauth && !to.meta.requiresAuth && to.name !== 'Verify') {
    if (!isAuthenticated.value) next()
    else if (accountType.value === 'marketer') next({ name: 'DashboardView' })
    else if (accountType.value === 'influencer') next({ name: 'TasksSearch' })
    return
  }

  next()
})

export default router
