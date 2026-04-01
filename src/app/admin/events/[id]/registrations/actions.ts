'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { TeamStatus } from '@/types'

export async function updateTeamStatus(eventId: string, teamId: string, status: TeamStatus) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('teams')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', teamId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/admin/events/${eventId}/registrations`)
}

export async function updateTeam(eventId: string, teamId: string, formData: FormData) {
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
}

export async function withdrawTeam(eventId: string, teamId: string) {
  return updateTeamStatus(eventId, teamId, 'withdrawn')
}
