import { RouteRecordRaw } from 'vue-router'
import { adminRoutes } from './admin/admin-routes'
import { dashboardRoutes } from './dashboard/dashboard.routes'
import { profileRoutes } from './profile/profile.routes'
import { createTaskRoutes } from './task-create/task-create.routes'
import { taskRoutes } from './task/task.routes'

export const marketerRoutes: Array<RouteRecordRaw> = [
  ...dashboardRoutes,
  ...createTaskRoutes,
  ...taskRoutes,
  ...profileRoutes,
  ...adminRoutes,
]
