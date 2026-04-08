'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createAnnouncement(eventId: string, formData: FormData, eventSlug?: string) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const is_urgent = formData.get('is_urgent') === 'on'

  const { error } = await supabase
    .from('announcements')
    .insert([
      {
        event_id: eventId,
        title,
        content,
        is_urgent
      }
    ])

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/admin/events/${eventId}/announcements`)
  if (eventSlug) revalidatePath(`/events/${eventSlug}`)
}

export async function updateAnnouncement(eventId: string, announcementId: string, formData: FormData, eventSlug?: string) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const is_urgent = formData.get('is_urgent') === 'on'

  const { error } = await supabase
    .from('announcements')
    .update({
      title,
      content,
      is_urgent,
      published_at: new Date().toISOString()
    })
    .eq('id', announcementId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/admin/events/${eventId}/announcements`)
  if (eventSlug) revalidatePath(`/events/${eventSlug}`)
}

export async function deleteAnnouncement(eventId: string, announcementId: string, eventSlug?: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', announcementId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/admin/events/${eventId}/announcements`)
  if (eventSlug) revalidatePath(`/events/${eventSlug}`)
}
