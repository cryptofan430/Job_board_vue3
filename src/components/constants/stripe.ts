import { getEnvironmentVariable } from '../helpers/system'

export const stripePublicKey = getEnvironmentVariable('VUE_APP_STRIPE_PUBLIC_KEY')
