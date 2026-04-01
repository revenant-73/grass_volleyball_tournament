import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Division } from '@/types'

export default async function PublicEventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: event, error } = await supabase
    .from('events')
    .select(`
      *,
      divisions (*)
    `)
    .eq('slug', slug)
    .single()

  if (error || !event || event.status === 'draft') {
    notFound()
  }

  const isRegistrationOpen = event.status === 'open'
  const upcomingDate = new Date(event.date_start) >= new Date(new Date().setHours(0,0,0,0))

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <Link href="/events" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-black dark:hover:text-white transition-colors mb-8 group">
            <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            All Events
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="flex-1">
               <div className="flex items-center gap-3 mb-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                    event.status === 'open' ? 'bg-green-500 text-white' :
                    event.status === 'live' ? 'bg-red-500 text-white animate-pulse' :
                    'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}>
                    {event.status}
                  </span>
                  <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">
                    {new Date(event.date_start).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
               </div>
               <h1 className="text-4xl lg:text-6xl font-black text-black dark:text-white uppercase tracking-tighter mb-4 leading-tight">
                  {event.name}
               </h1>
               <p className="text-xl font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location_name}
               </p>
            </div>
            {isRegistrationOpen && upcomingDate && (
               <button className="w-full lg:w-auto px-12 py-5 bg-black text-white dark:bg-white dark:text-black font-black rounded-2xl hover:opacity-90 transition-opacity uppercase tracking-tighter shadow-2xl">
                  Register Team
               </button>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="relative h-[400px] w-full bg-zinc-200 dark:bg-zinc-900 rounded-[3rem] overflow-hidden mb-12 shadow-inner">
           {event.banner_url ? (
              <Image src={event.banner_url} alt={event.name} fill className="object-cover" unoptimized />
           ) : (
              <div className="w-full h-full flex items-center justify-center opacity-10">
                 <svg className="w-32 h-32 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                 </svg>
              </div>
           )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-16">
            <section>
              <h2 className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.3em] mb-8">About the Event</h2>
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                 <p className="text-xl font-bold leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {event.description || "No description provided."}
                 </p>
              </div>
            </section>

            <section>
              <h2 className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.3em] mb-8">Tournament Divisions</h2>
              <div className="grid grid-cols-1 gap-6">
                 {event.divisions && event.divisions.length > 0 ? (
                    event.divisions.map((division: Division) => (
                       <div key={division.id} className="p-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl flex items-center justify-between group hover:border-black dark:hover:border-white transition-all shadow-sm">
                          <div>
                             <h3 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter mb-2">{division.name}</h3>
                             <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-3">
                                <span>{division.level}</span>
                                <span className="w-1 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                                <span>{division.format_type}</span>
                                <span className="w-1 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                                <span>Limit {division.team_cap} Teams</span>
                             </p>
                          </div>
                          <div className="text-right">
                             <p className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter">${(division.price_cents || 0) / 100}</p>
                             <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">per team</p>
                          </div>
                       </div>
                    ))
                 ) : (
                    <p className="text-zinc-500 font-bold italic">No divisions listed for this event yet.</p>
                 )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-10">
             <div className="p-8 bg-zinc-100 dark:bg-zinc-900 rounded-[2.5rem] space-y-8">
                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Quick Details</h3>
                <div className="space-y-6">
                   <div className="flex gap-4">
                      <div className="w-10 h-10 bg-white dark:bg-black rounded-xl flex items-center justify-center shadow-sm">
                         <svg className="w-5 h-5 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">First Serve</p>
                         <p className="font-black text-black dark:text-white uppercase tracking-tighter">{event.start_time || "TBD"}</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="w-10 h-10 bg-white dark:bg-black rounded-xl flex items-center justify-center shadow-sm">
                         <svg className="w-5 h-5 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Check-in</p>
                         <p className="font-black text-black dark:text-white uppercase tracking-tighter">{event.check_in_time || "TBD"}</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="w-10 h-10 bg-white dark:bg-black rounded-xl flex items-center justify-center shadow-sm">
                         <svg className="w-5 h-5 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                         </svg>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Location</p>
                         <p className="font-black text-black dark:text-white uppercase tracking-tighter line-clamp-2">{event.location_address || event.location_name}</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 gap-4">
                <button disabled className="w-full py-5 border-2 border-zinc-100 dark:border-zinc-800 text-zinc-300 dark:text-zinc-700 font-black rounded-2xl uppercase tracking-tighter opacity-50 cursor-not-allowed">
                   Event Schedule
                </button>
                <button disabled className="w-full py-5 border-2 border-zinc-100 dark:border-zinc-800 text-zinc-300 dark:text-zinc-700 font-black rounded-2xl uppercase tracking-tighter opacity-50 cursor-not-allowed">
                   Standings / Results
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
