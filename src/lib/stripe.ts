import Stripe from 'stripe'

// We use a getter function to avoid instantiating Stripe at the module level.
// This prevents build-time errors when STRIPE_SECRET_KEY is missing.
export function getStripe() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  
  if (!stripeSecretKey) {
    // We throw only when the function is actually called, which happens at runtime.
    throw new Error('STRIPE_SECRET_KEY is not set')
  }

  return new Stripe(stripeSecretKey, {
    apiVersion: '2026-03-25.dahlia',
    typescript: true,
  })
}
