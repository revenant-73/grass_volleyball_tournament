'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-black uppercase tracking-tighter text-black dark:text-white">
            Grass Doubles
          </span>
        </Link>
        
        {/* Desktop Nav */}
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

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-black border-b border-zinc-100 dark:border-zinc-900 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col p-4 space-y-4">
            <Link 
              href="/events" 
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-black text-black dark:text-white uppercase tracking-tighter py-2 border-b border-zinc-50 dark:border-zinc-900"
            >
              Tournaments
            </Link>
            <Link 
              href="/#directors" 
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-black text-black dark:text-white uppercase tracking-tighter py-2 border-b border-zinc-50 dark:border-zinc-900"
            >
              For Directors
            </Link>
            {user ? (
              <Link 
                href="/admin" 
                onClick={() => setIsMenuOpen(false)}
                className="w-full py-4 bg-black text-white dark:bg-white dark:text-black text-center text-sm font-black uppercase tracking-widest rounded-2xl"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link 
                href="/login" 
                onClick={() => setIsMenuOpen(false)}
                className="w-full py-4 border-2 border-zinc-100 dark:border-zinc-900 text-black dark:text-white text-center text-sm font-black uppercase tracking-widest rounded-2xl"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
