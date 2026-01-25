import Stripe from 'stripe'

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
  typescript: true,
})

// Featured Listing Price ID - $49/month
export const STRIPE_FEATURED_PRICE_ID = process.env.STRIPE_FEATURED_PRICE_ID!
