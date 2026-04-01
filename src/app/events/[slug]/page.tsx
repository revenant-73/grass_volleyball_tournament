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
      divisions (*),
      announcements (*),
      sponsors (*)
    `)
    .eq('slug', slug)
    .single()

  if (error || !event || event.status === 'draft') {
    notFound()
  }

  const urgentAnnouncement = event.announcements?.find((a: any) => a.is_urgent)
  const regularAnnouncements = event.announcements?.filter((a: any) => !a.is_urgent) || []

  const isRegistrationOpen = event.status === 'open'
  const upcomingDate = new Date(event.date_start) >= new Date(new Date().setHours(0,0,0,0))

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        {urgentAnnouncement && (
          <div className="mb-8 p-6 bg-red-600 text-white rounded-[2rem] shadow-xl animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/20 rounded-xl">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight mb-1">{urgentAnnouncement.title}</h3>
                <p className="font-bold opacity-90">{urgentAnnouncement.content}</p>
              </div>
            </div>
          </div>
        )}

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
               <Link 
                 href={`/events/${event.slug}/register`}
                 className="w-full lg:w-auto px-12 py-5 bg-black text-white dark:bg-white dark:text-black font-black rounded-2xl hover:opacity-90 transition-opacity uppercase tracking-tighter shadow-2xl text-center"
               >
                  Register Team
               </Link>
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

            {regularAnnouncements.length > 0 && (
              <section>
                <h2 className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.3em] mb-8">Latest Updates</h2>
                <div className="space-y-4">
                  {regularAnnouncements.map((announcement: any) => (
                    <div key={announcement.id} className="p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-black text-black dark:text-white uppercase tracking-tight">{announcement.title}</h3>
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                          {new Date(announcement.published_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400 font-bold leading-relaxed">{announcement.content}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.3em] mb-8">Tournament Divisions</h2>
              <div className="grid grid-cols-1 gap-6">
                 {event.divisions && event.divisions.length > 0 ? (
                    event.divisions.map((division: Division) => (
                       <Link 
                          key={division.id} 
                          href={`/events/${event.slug}/register?divisionId=${division.id}`}
                          className="p-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl flex items-center justify-between group hover:border-black dark:hover:border-white transition-all shadow-sm text-left"
                       >
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
                       </Link>
                    ))
                 ) : (
                    <p className="text-zinc-500 font-bold italic">No divisions listed for this event yet.</p>
                 )}
              </div>
            </section>

            {event.sponsors && event.sponsors.length > 0 && (
              <section>
                <h2 className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.3em] mb-8">Event Sponsors</h2>
                <div className="flex flex-wrap items-center gap-12">
                  {event.sponsors
                    .sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))
                    .map((sponsor: any) => (
                    <div key={sponsor.id} className="group transition-all duration-500">
                      {sponsor.website_url ? (
                        <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer" className="block text-center space-y-3">
                          <div className="relative w-32 h-20 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                            {sponsor.logo_url ? (
                              <Image src={sponsor.logo_url} alt={sponsor.name} fill className="object-contain" unoptimized />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-black text-zinc-300 dark:text-zinc-700 text-xs uppercase tracking-tighter">
                                {sponsor.name}
                              </div>
                            )}
                          </div>
                        </a>
                      ) : (
                        <div className="text-center space-y-3">
                          <div className="relative w-32 h-20 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                            {sponsor.logo_url ? (
                              <Image src={sponsor.logo_url} alt={sponsor.name} fill className="object-contain" unoptimized />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-black text-zinc-300 dark:text-zinc-700 text-xs uppercase tracking-tighter">
                                {sponsor.name}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
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
