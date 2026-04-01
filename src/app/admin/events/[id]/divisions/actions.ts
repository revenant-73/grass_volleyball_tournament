'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createDivision(eventId: string, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const level = formData.get('level') as string
  const format_type = formData.get('format_type') as string
  const team_cap = parseInt(formData.get('team_cap') as string) || 16
  const price_cents = Math.round(parseFloat(formData.get('price') as string) * 100) || 0
  const waitlist_enabled = formData.get('waitlist_enabled') === 'on'
  const teams_advance_count = parseInt(formData.get('teams_advance_count') as string) || 2
  const bracket_type = formData.get('bracket_type') as string || 'single_elimination'

  const { error } = await supabase
    .from('divisions')
    .insert([
      {
        event_id: eventId,
        name,
        level,
        format_type,
        team_cap,
        price_cents,
        waitlist_enabled,
        teams_advance_count,
        bracket_type
      }
    ])
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/admin/events/${eventId}`)
  redirect(`/admin/events/${eventId}`)
}

export async function updateDivision(eventId: string, divisionId: string, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const level = formData.get('level') as string
  const format_type = formData.get('format_type') as string
  const team_cap = parseInt(formData.get('team_cap') as string) || 16
  const price_cents = Math.round(parseFloat(formData.get('price') as string) * 100) || 0
  const waitlist_enabled = formData.get('waitlist_enabled') === 'on'
  const teams_advance_count = parseInt(formData.get('teams_advance_count') as string) || 2
  const bracket_type = formData.get('bracket_type') as string || 'single_elimination'

  const { error } = await supabase
    .from('divisions')
    .update({
      name,
      level,
      format_type,
      team_cap,
      price_cents,
      waitlist_enabled,
      teams_advance_count,
      bracket_type
    })
    .eq('id', divisionId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/admin/events/${eventId}`)
  redirect(`/admin/events/${eventId}`)
}

export async function deleteDivision(eventId: string, divisionId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('divisions')
    .delete()
    .eq('id', divisionId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/admin/events/${eventId}`)
  redirect(`/admin/events/${eventId}`)
}
