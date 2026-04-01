'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  console.log('--- LOGIN ATTEMPT ---')
  console.log('Email:', email)
  
  const supabase = await createClient()

  const data = {
    email,
    password: formData.get('password') as string,
  }

  const { error, data: authData } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Auth Error:', error.message)
    return { error: error.message }
  }

  console.log('Auth Success for:', authData.user?.email)
  console.log('Redirecting to /admin...')
  
  revalidatePath('/', 'layout')
  redirect('/admin')
}
