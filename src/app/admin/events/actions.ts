'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { SupabaseClient } from '@supabase/supabase-js'

async function uploadBanner(supabase: SupabaseClient, file: File) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `banners/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('event-banners')
    .upload(filePath, file)

  if (uploadError) {
    throw new Error(`Error uploading banner: ${uploadError.message}`)
  }

  const { data } = supabase.storage
    .from('event-banners')
    .getPublicUrl(filePath)

  return data.publicUrl
}

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
  const status = formData.get('status') as string || 'draft'
  const registration_open_at = formData.get('registration_open_at') as string || null
  const registration_close_at = formData.get('registration_close_at') as string || null
  
  const bannerFile = formData.get('banner') as File | null
  let banner_url = null

  if (bannerFile && bannerFile.size > 0) {
    try {
      banner_url = await uploadBanner(supabase, bannerFile)
    } catch (err) {
      console.error(err)
    }
  }

  const { data, error } = await supabase
    .from('events')
    .insert([
      {
        name,
        slug,
        description,
        banner_url,
        date_start,
        date_end,
        location_name,
        location_address,
        check_in_time,
        start_time,
        status,
        registration_open_at,
        registration_close_at
      }
    ])
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/events')
  redirect(`/admin/events/${data.id}`)
}

export async function updateEvent(id: string, formData: FormData) {
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
  const status = formData.get('status') as string
  const registration_open_at = formData.get('registration_open_at') as string || null
  const registration_close_at = formData.get('registration_close_at') as string || null

  const bannerFile = formData.get('banner') as File | null
  let banner_url = undefined

  if (bannerFile && bannerFile.size > 0) {
    try {
      banner_url = await uploadBanner(supabase, bannerFile)
    } catch (err) {
      console.error(err)
    }
  }

  const updateData: Record<string, string | null | undefined> = {
    name,
    slug,
    description,
    date_start,
    date_end,
    location_name,
    location_address,
    check_in_time,
    start_time,
    status,
    registration_open_at,
    registration_close_at,
    updated_at: new Date().toISOString()
  }

  if (banner_url) {
    updateData.banner_url = banner_url
  }

  const { error } = await supabase
    .from('events')
    .update(updateData)
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/events')
  revalidatePath(`/admin/events/${id}`)
  redirect(`/admin/events/${id}`)
}

