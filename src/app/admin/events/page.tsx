import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Event } from '@/types'

export default async function EventsPage() {
  const supabase = await createClient()
  
  const { data: events } = await supabase
    .from('events')
    .select(`
      *,
      divisions (count)
    `)
    .order('date_start', { ascending: false })

  return (
    <div className="p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 pb-8 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter">
                Tournaments
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 font-bold mt-1">
                Manage your event schedule and registrations
              </p>
            </div>
            <Link 
              href="/admin/events/new"
              className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity text-center"
            >
              + New Event
            </Link>
          </div>
        </header>

        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {events.map((event: Event & { divisions?: { count: number }[] }) => (
              <div 
                key={event.id}
                className="group bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Event Thumbnail Placeholder */}
                  <div className="relative w-full md:w-48 h-32 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800">
                    {event.banner_url ? (
                      <Image src={event.banner_url} alt={event.name} fill className="object-cover" unoptimized />
                    ) : (
                      <svg className="w-8 h-8 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 p-6 flex flex-col justify-center">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                            event.status === 'open' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            event.status === 'live' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                          }`}>
                            {event.status}
                          </span>
                          <span className="text-xs font-bold text-zinc-400 uppercase tracking-tight">
                            {new Date(event.date_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                          {event.name}
                        </h3>
                        <p className="text-sm text-zinc-500 font-bold mt-1 line-clamp-1 italic">
                          {event.location_name}
                        </p>
                      </div>

                      <div className="flex gap-2">
                         <Link 
                           href={`/admin/events/${event.id}`}
                           className="p-2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                           title="Manage"
                         >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                         </Link>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-6 pt-4 border-t border-zinc-50 dark:border-zinc-900">
                       <div>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Divisions</p>
                          <p className="font-bold text-black dark:text-white">{event.divisions?.[0]?.count ?? 0}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Registrations</p>
                          <p className="font-bold text-black dark:text-white">0</p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12 p-16 border-2 border-dashed border-zinc-200 dark:border-zinc-900 rounded-3xl flex flex-col items-center justify-center text-center bg-white/50 dark:bg-zinc-950/50">
             <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-8">
                <svg className="w-10 h-10 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
             </div>
             <h2 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter">No events found</h2>
             <p className="text-zinc-500 dark:text-zinc-400 mt-3 max-w-sm font-bold">
                You haven&apos;t created any events yet. Launch your first tournament to start accepting teams.
             </p>
             <Link 
               href="/admin/events/new"
               className="mt-10 px-10 py-4 bg-black text-white dark:bg-white dark:text-black font-black rounded-xl hover:opacity-90 transition-opacity uppercase tracking-tighter"
             >
                Create Event
             </Link>
          </div>
        )}
      </div>
    </div>
  )
}
