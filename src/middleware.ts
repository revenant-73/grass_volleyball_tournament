import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  console.log('--- MIDDLEWARE ---')
  console.log('Path:', path)

  // Update the session first
  const { supabase, supabaseResponse } = await updateSession(request)

  // Protect admin routes
  if (path.startsWith('/admin')) {
    const { data: { user } } = await supabase.auth.getUser()
    console.log('User status for admin path:', user ? `Logged in as ${user.email}` : 'Not logged in')

    if (!user) {
      console.log('No user, redirecting to /login')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Role check
    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('email', user.email)
      .single()
    
    console.log('User data lookup:', { role: userData?.role, error: error?.message })

    if (error || !userData || (userData.role !== 'super_admin' && userData.role !== 'event_admin')) {
      console.log('Role unauthorized or error, signing out and redirecting...')
      // If not an admin, sign them out and redirect
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/login?error=Unauthorized access', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
