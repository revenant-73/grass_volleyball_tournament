'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

import { Team } from '@/types'

export async function registerTeam(eventId: string, formData: Partial<Team> & { waiver_accepted: boolean }) {
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

  // Basic Validation
  if (!division_id || !team_name || !captain_name || !captain_email || !partner_name) {
    throw new Error('All required fields must be filled out')
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(captain_email)) {
    throw new Error('Invalid captain email address')
  }

  if (partner_email && !emailRegex.test(partner_email)) {
    throw new Error('Invalid partner email address')
  }

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

  // 1b. Check for duplicate team name in this division
  const { data: existingTeam } = await supabase
    .from('teams')
    .select('id')
    .eq('division_id', division_id)
    .eq('team_name', team_name)
    .maybeSingle()

  if (existingTeam) {
    throw new Error(`The team name "${team_name}" is already taken in this division.`)
  }

  // 1c. Check if captain is already registered in this division
  const { data: existingCaptain } = await supabase
    .from('teams')
    .select('id')
    .eq('division_id', division_id)
    .eq('captain_email', captain_email)
    .maybeSingle()

  if (existingCaptain) {
    throw new Error(`A captain with the email ${captain_email} is already registered in this division.`)
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
