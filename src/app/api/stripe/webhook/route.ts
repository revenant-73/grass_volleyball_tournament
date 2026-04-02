import { getStripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headerList = await headers()
  const sig = headerList.get('stripe-signature') as string
  const stripe = getStripe()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  const supabase = await createClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const teamId = session.metadata?.teamId
    const divisionId = session.metadata?.divisionId

    if (teamId) {
      // 1. Update team status to paid
      const { error: teamError } = await supabase
        .from('teams')
        .update({ status: 'paid', updated_at: new Date().toISOString() })
        .eq('id', teamId)

      if (teamError) {
        console.error('Error updating team status:', teamError)
      }

      // 2. Record payment
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([
          {
            team_id: teamId,
            division_id: divisionId,
            stripe_checkout_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent as string,
            amount_cents: session.amount_total,
            currency: session.currency,
            payment_status: 'succeeded',
            paid_at: new Date().toISOString()
          }
        ])

      if (paymentError) {
        console.error('Error recording payment:', paymentError)
      }
    }
  }

  return NextResponse.json({ received: true })
}
