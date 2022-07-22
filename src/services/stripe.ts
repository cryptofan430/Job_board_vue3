import { stripePublicKey } from '@/components/constants/stripe'
import { loadStripe } from '@stripe/stripe-js'

export const getStripe = () => loadStripe(stripePublicKey)
