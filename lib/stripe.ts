import Stripe from 'stripe'

// Server-side Stripe instance - use placeholder during build if env var missing
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_placeholder_for_build'

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-01-27.acacia',
  typescript: true,
})

// Featured Listing Price ID - $49/month
export const STRIPE_FEATURED_PRICE_ID = process.env.STRIPE_FEATURED_PRICE_ID || ''
