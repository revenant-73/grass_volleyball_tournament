'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface TournamentNavProps {
  slug: string
  eventName: string
}

export default function TournamentNav({ slug, eventName }: TournamentNavProps) {
  const pathname = usePathname()

  const tabs = [
    { name: 'Info', href: `/events/${slug}` },
    { name: 'Schedule', href: `/events/${slug}/schedule` },
    { name: 'Standings', href: `/events/${slug}/standings` },
    { name: 'Bracket', href: `/events/${slug}/bracket` },
  ]

  return (
    <div className="mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
         <div>
            <Link href={`/events/${slug}`} className="inline-block">
               <h1 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter hover:opacity-70 transition-opacity">
                  {eventName}
               </h1>
            </Link>
         </div>
         <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    isActive
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg'
                      : 'text-zinc-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {tab.name}
                </Link>
              )
            })}
         </div>
      </div>
    </div>
  )
}
