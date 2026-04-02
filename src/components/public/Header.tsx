import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-black uppercase tracking-tighter text-black dark:text-white">
            Grass Doubles
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/events" className="text-sm font-bold text-zinc-500 hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest">
            Tournaments
          </Link>
          <Link href="/#directors" className="text-sm font-bold text-zinc-500 hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest">
            For Directors
          </Link>
          {user ? (
            <Link href="/admin" className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black text-xs font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="text-sm font-bold text-zinc-500 hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
