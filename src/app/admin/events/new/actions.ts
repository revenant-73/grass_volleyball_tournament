'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createEvent(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
  const description = formData.get('description') as string
  const date_start = formData.get('date_start') as string
  const date_end = formData.get('date_end') as string || date_start
  const location_name = formData.get('location_name') as string
  const location_address = formData.get('location_address') as string
  const check_in_time = formData.get('check_in_time') as string
  const start_time = formData.get('start_time') as string
  const status = 'draft' // Default to draft

  const { data, error } = await supabase
    .from('events')
    .insert([
      {
        name,
        slug,
        description,
        date_start,
        date_end,
        location_name,
        location_address,
        check_in_time,
        start_time,
        status
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating event:', error)
    redirect(`/admin/events/new?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/events')
  redirect(`/admin/events/${data.id}`)
}
