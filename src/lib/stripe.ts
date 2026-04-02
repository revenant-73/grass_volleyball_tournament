import Stripe from 'stripe'

// We don't throw at the top level here to avoid crashing the build
// if the env var isn't present during the build phase.
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ''

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2026-03-25.dahlia',
  typescript: true,
})
