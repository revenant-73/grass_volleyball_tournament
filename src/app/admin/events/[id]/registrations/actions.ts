'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { TeamStatus } from '@/types'
import { getStripe } from '@/lib/stripe'

export async function updateTeamStatus(eventId: string, teamId: string, status: TeamStatus, eventSlug?: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('teams')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', teamId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/admin/events/${eventId}/registrations`)
  
  if (eventSlug) {
    revalidatePath(`/events/${eventSlug}`)
  }
}

export async function refundTeam(eventId: string, teamId: string, eventSlug?: string) {
  const supabase = await createClient()
  const stripe = getStripe()

  // 1. Get payment info
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .select('*')
    .eq('team_id', teamId)
    .eq('payment_status', 'succeeded')
    .single()

  if (paymentError || !payment) {
    throw new Error('No successful payment found for this team')
  }

  if (!payment.stripe_payment_intent_id) {
    throw new Error('No Stripe Payment Intent ID found')
  }

  try {
    // 2. Trigger Stripe refund
    await stripe.refunds.create({
      payment_intent: payment.stripe_payment_intent_id,
    })

    // 3. Update payment record
    const { error: updatePaymentError } = await supabase
      .from('payments')
      .update({ 
        payment_status: 'refunded', 
        updated_at: new Date().toISOString() 
      })
      .eq('id', payment.id)

    if (updatePaymentError) {
      console.error('Error updating payment record:', updatePaymentError)
    }

    // 4. Update team status to withdrawn
    const { error: updateTeamError } = await supabase
      .from('teams')
      .update({ 
        status: 'withdrawn', 
        updated_at: new Date().toISOString() 
      })
      .eq('id', teamId)

    if (updateTeamError) {
      console.error('Error updating team status:', updateTeamError)
    }

    revalidatePath(`/admin/events/${eventId}/registrations`)
    
    if (eventSlug) {
      revalidatePath(`/events/${eventSlug}`)
      revalidatePath(`/events/${eventSlug}/register`)
    }

    return { success: true }
  } catch (err: unknown) {
    console.error('Stripe refund error:', err)
    const message = err instanceof Error ? err.message : 'Failed to process refund with Stripe'
    throw new Error(message)
  }
}

export async function updateTeam(eventId: string, teamId: string, formData: FormData, eventSlug?: string) {
  const supabase = await createClient()

  const team_name = formData.get('team_name') as string
  const captain_name = formData.get('captain_name') as string
  const captain_email = formData.get('captain_email') as string
  const captain_phone = formData.get('captain_phone') as string
  const partner_name = formData.get('partner_name') as string
  const partner_email = formData.get('partner_email') as string
  const partner_phone = formData.get('partner_phone') as string
  const club_name = formData.get('club_name') as string
  const city = formData.get('city') as string
  const status = formData.get('status') as TeamStatus

  const { error } = await supabase
    .from('teams')
    .update({
      team_name,
      captain_name,
      captain_email,
      captain_phone,
      partner_name,
      partner_email,
      partner_phone,
      club_name,
      city,
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', teamId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/admin/events/${eventId}/registrations`)
  
  if (eventSlug) {
    revalidatePath(`/events/${eventSlug}`)
  }
}

export async function withdrawTeam(eventId: string, teamId: string, eventSlug?: string) {
  return updateTeamStatus(eventId, teamId, 'withdrawn', eventSlug)
}

export async function toggleCheckIn(eventId: string, teamId: string, isCheckedIn: boolean, eventSlug?: string) {
  const supabase = await createClient()

  if (isCheckedIn) {
    // Check in
    const { error } = await supabase
      .from('check_ins')
      .insert([{ team_id: teamId, event_id: eventId }])
    
    if (error) throw new Error(error.message)
  } else {
    // Undo check in (delete records for this team/event)
    const { error } = await supabase
      .from('check_ins')
      .delete()
      .eq('team_id', teamId)
      .eq('event_id', eventId)
    
    if (error) throw new Error(error.message)
  }

  revalidatePath(`/admin/events/${eventId}/check-in`)
  revalidatePath(`/admin/events/${eventId}/registrations`)
  
  if (eventSlug) {
    revalidatePath(`/events/${eventSlug}`)
    revalidatePath(`/events/${eventSlug}/register`)
  }
}

export async function saveSeeding(eventId: string, divisionId: string, teamSeeds: { teamId: string, seed: number }[], eventSlug?: string) {
  const supabase = await createClient()

  // We perform individual updates since Supabase doesn't support bulk updates easily with different values per row
  const updates = teamSeeds.map(ts => 
    supabase
      .from('teams')
      .update({ manual_seed: ts.seed })
      .eq('id', ts.teamId)
  )

  const results = await Promise.all(updates)
  const errors = results.filter(r => r.error)

  if (errors.length > 0) {
    throw new Error('Failed to save some seeding updates')
  }

  revalidatePath(`/admin/events/${eventId}/seeding`)
  revalidatePath(`/admin/events/${eventId}/pools`)
  
  if (eventSlug) {
    revalidatePath(`/events/${eventSlug}/standings`)
  }
}
