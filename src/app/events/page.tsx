import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Event } from '@/types'

export default async function PublicEventsPage() {
  const supabase = await createClient()

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .neq('status', 'draft')
    .order('date_start', { ascending: true })

  if (error) {
    console.error('Error fetching events:', error)
  }

  const upcomingEvents = events?.filter(e => new Date(e.date_start) >= new Date(new Date().setHours(0,0,0,0))) || []
  const pastEvents = events?.filter(e => new Date(e.date_start) < new Date(new Date().setHours(0,0,0,0))) || []

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8 lg:p-12 pt-24 sm:pt-32">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 text-center lg:text-left">
          <h1 className="text-5xl font-black text-black dark:text-white uppercase tracking-tighter mb-4">
            Tournament Schedule
          </h1>
          <p className="text-xl font-bold text-zinc-500 dark:text-zinc-400">
            Find and register for upcoming grass doubles events.
          </p>
        </header>

        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {upcomingEvents.map((event: Event) => (
              <Link 
                key={event.id} 
                href={`/events/${event.slug}`}
                className="group bg-card border-border rounded-3xl shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col"
              >
                <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                  {event.banner_url ? (
                    <Image 
                      src={event.banner_url} 
                      alt={event.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                      <svg className="w-16 h-16 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      event.status === 'open' ? 'bg-green-500 text-white shadow-lg' :
                      event.status === 'live' ? 'bg-red-500 text-white animate-pulse shadow-lg' :
                      'bg-zinc-900 text-white/50'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">
                    {new Date(event.date_start).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  <h3 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter mb-4 line-clamp-2">
                    {event.name}
                  </h3>
                  <div className="mt-auto space-y-4">
                    <div className="flex items-start gap-2 text-zinc-500 dark:text-zinc-400">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm font-bold">{event.location_name}</span>
                    </div>
                    <button className="w-full py-4 bg-zinc-50 dark:bg-zinc-900 group-hover:bg-black dark:group-hover:bg-white text-black dark:text-white group-hover:text-white dark:group-hover:text-black font-black rounded-2xl transition-all uppercase tracking-tighter text-sm">
                      View Event
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-16 border-4 border-dashed border-zinc-200 dark:border-zinc-900 rounded-[3rem] text-center mb-24">
            <h2 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter mb-4">No upcoming events</h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-bold max-w-sm mx-auto uppercase tracking-widest text-xs">
              Check back soon for new tournaments and registration dates!
            </p>
          </div>
        )}

        {pastEvents.length > 0 && (
          <section className="pt-12 border-t border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em] mb-12">Completed Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {pastEvents.map((event: Event) => (
                  <Link 
                    key={event.id} 
                    href={`/events/${event.slug}`}
                    className="p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-black dark:hover:border-white transition-all opacity-60 hover:opacity-100"
                  >
                     <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">
                        {new Date(event.date_start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                     </p>
                     <h4 className="font-black text-black dark:text-white uppercase tracking-tighter line-clamp-1">{event.name}</h4>
                  </Link>
               ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
