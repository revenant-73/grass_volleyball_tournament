'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { SupabaseClient } from '@supabase/supabase-js'

async function uploadLogo(supabase: SupabaseClient, file: File) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `logos/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('sponsor-logos')
    .upload(filePath, file)

  if (uploadError) {
    throw new Error(`Error uploading logo: ${uploadError.message}`)
  }

  const { data } = supabase.storage
    .from('sponsor-logos')
    .getPublicUrl(filePath)

  return data.publicUrl
}

export async function createSponsor(eventId: string, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const website_url = formData.get('website_url') as string
  const display_order = parseInt(formData.get('display_order') as string) || 0
  
  const logoFile = formData.get('logo') as File | null
  let logo_url = null

  if (logoFile && logoFile.size > 0) {
    logo_url = await uploadLogo(supabase, logoFile)
  }

  const { error } = await supabase
    .from('sponsors')
    .insert([
      {
        event_id: eventId,
        name,
        website_url,
        logo_url,
        display_order
      }
    ])

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/admin/events/${eventId}/sponsors`)
}

export async function updateSponsor(eventId: string, sponsorId: string, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const website_url = formData.get('website_url') as string
  const display_order = parseInt(formData.get('display_order') as string) || 0
  
  const logoFile = formData.get('logo') as File | null
  let logo_url = undefined

  if (logoFile && logoFile.size > 0) {
    logo_url = await uploadLogo(supabase, logoFile)
  }

  const updateData: any = {
    name,
    website_url,
    display_order
  }

  if (logo_url) {
    updateData.logo_url = logo_url
  }

  const { error } = await supabase
    .from('sponsors')
    .update(updateData)
    .eq('id', sponsorId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/admin/events/${eventId}/sponsors`)
}

export async function deleteSponsor(eventId: string, sponsorId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('sponsors')
    .delete()
    .eq('id', sponsorId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/admin/events/${eventId}/sponsors`)
}
