import { getEnvironmentVariable } from '../helpers/system'

export const maintenanceMode = getEnvironmentVariable('VUE_APP_MAINTENANCE_MODE')
export const maintenanceModeEndDate = getEnvironmentVariable('VUE_APP_MAINTENANCE_END_DATE')
