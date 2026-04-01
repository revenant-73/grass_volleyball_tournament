import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Update the session first
  const { supabase, supabaseResponse } = await updateSession(request)

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Role check
    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('email', user.email)
      .single()

    if (error || !userData || (userData.role !== 'super_admin' && userData.role !== 'event_admin')) {
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
