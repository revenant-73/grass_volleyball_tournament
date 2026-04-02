import { getStripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const teamId = searchParams.get('teamId')

  if (!teamId) {
    return NextResponse.json({ error: 'Team ID is required' }, { status: 400 })
  }

  const supabase = await createClient()
  const stripe = getStripe()

  // Fetch team and division details
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .select(`
      *,
      division:divisions (
        *,
        event:events (*)
      )
    `)
    .eq('id', teamId)
    .single()

  if (teamError || !team) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 })
  }

  const division = team.division
  const event = division.event

  if (!division.price_cents || division.price_cents === 0) {
    return NextResponse.redirect(new URL(`/events/registration-confirmed?teamId=${team.id}`, req.url))
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${event.name} - ${division.name}`,
              description: `Team: ${team.team_name} | Captain: ${team.captain_name}`,
            },
            unit_amount: division.price_cents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/events/registration-confirmed?teamId=${team.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/events/${event.slug}/register?divisionId=${division.id}`,
      metadata: {
        teamId: team.id,
        divisionId: division.id,
        eventId: event.id,
      },
    })

    if (!session.url) {
      throw new Error('Failed to create stripe session url')
    }

    return NextResponse.redirect(session.url)
  } catch (err: any) {
    console.error('Stripe error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
