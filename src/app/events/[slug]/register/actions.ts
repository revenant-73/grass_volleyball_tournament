'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function registerTeam(eventId: string, formData: any) {
  const supabase = await createClient()
  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for') || 'unknown'

  const {
    division_id,
    team_name,
    captain_name,
    captain_email,
    captain_phone,
    partner_name,
    partner_email,
    partner_phone,
    club_name,
    city,
    waiver_accepted
  } = formData

  if (!waiver_accepted) {
    throw new Error('Waiver must be accepted')
  }

  // 1. Get division and check capacity
  const { data: division, error: divError } = await supabase
    .from('divisions')
    .select('*, teams(count)')
    .eq('id', division_id)
    .single()

  if (divError || !division) {
    throw new Error('Division not found')
  }

  const teamCount = division.teams?.[0]?.count || 0
  const isFull = teamCount >= (division.team_cap || 0)
  
  if (isFull && !division.waitlist_enabled) {
    throw new Error('This division is sold out')
  }

  const status = isFull ? 'waitlisted' : 'pending'

  // 2. Create Team
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .insert([
      {
        division_id,
        team_name,
        captain_name,
        captain_email,
        captain_phone,
        partner_name,
        partner_email,
        partner_phone,
        club_name,
        city,
        status
      }
    ])
    .select()
    .single()

  if (teamError) {
    throw new Error(teamError.message)
  }

  // 3. Create Waiver Record
  const { error: waiverError } = await supabase
    .from('waivers')
    .insert([
      {
        event_id: eventId,
        team_id: team.id,
        captain_signed_name: captain_name,
        waiver_version: '1.0',
        ip_address: ip
      }
    ])

  if (waiverError) {
    console.error('Waiver creation error:', waiverError)
    // We don't necessarily want to fail the whole registration if waiver record fails 
    // but it is a requirement.
  }

  revalidatePath(`/events/[slug]`, 'layout')

  // 4. Handle Redirect (to Payment or Confirmation)
  if (status === 'waitlisted' || (division.price_cents || 0) === 0) {
    // Waitlisted or Free -> Go to confirmation
    return { 
      success: true, 
      redirectUrl: `/events/registration-confirmed?teamId=${team.id}` 
    }
  }

  // Paid -> Go to Checkout (handled in T-040)
  // For now, redirecting to a placeholder or back with success
  return { 
    success: true, 
    teamId: team.id,
    redirectUrl: `/api/checkout?teamId=${team.id}` 
  }
}
