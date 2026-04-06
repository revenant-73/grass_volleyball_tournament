import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import QRCodeDownloader from '@/components/admin/QRCodeDownloader'
import { Division } from '@/types'

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: event, error } = await supabase
    .from('events')
    .select(`
      *,
      divisions (*, teams(count))
    `)
    .eq('id', id)
    .single()

  if (error || !event) {
    notFound()
  }

  const publicUrl = `/events/${event.slug}`

  // Calculate total teams
  const totalTeams = event.divisions?.reduce((acc: number, d: Division & { teams?: { count: number }[] }) => acc + (d.teams?.[0]?.count || 0), 0) || 0
  const totalRevenueCents = event.divisions?.reduce((acc: number, d: Division & { teams?: { count: number }[] }) => acc + ((d.teams?.[0]?.count || 0) * (d.price_cents || 0)), 0) || 0
  const totalRevenue = totalRevenueCents / 100

  return (
    <div className="p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 pb-8 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/admin/events"
              className="p-2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                event.status === 'open' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
              }`}>
                {event.status}
              </span>
              <h1 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter">
                {event.name}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 ml-12">
             <Link 
               href={`/admin/events/${event.id}/edit`}
               className="px-6 py-2 bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white font-bold rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors uppercase text-sm tracking-tighter"
             >
                Edit Event
             </Link>
             <Link 
               href={`/events/${event.slug}`}
               target="_blank"
               className="px-6 py-2 border-2 border-zinc-100 dark:border-zinc-800 text-zinc-500 hover:text-black dark:hover:text-white font-bold rounded-lg transition-all uppercase text-sm tracking-tighter"
             >
                View Public Page
             </Link>
          </div>
        </header>
        
        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
          <Link 
            href={`/admin/events/${id}/registrations`}
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-black dark:hover:border-white transition-all group"
          >
            <svg className="w-8 h-8 mb-3 text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-black dark:group-hover:text-white text-center">Teams</span>
          </Link>
          
          <Link 
            href={`/admin/events/${id}/check-in`}
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-black dark:hover:border-white transition-all group"
          >
            <svg className="w-8 h-8 mb-3 text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-black dark:group-hover:text-white text-center">Check-In</span>
          </Link>

          <Link 
            href={`/admin/events/${id}/seeding`}
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-black dark:hover:border-white transition-all group"
          >
            <svg className="w-8 h-8 mb-3 text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0V12m-3 .5a1.5 1.5 0 003 0M10 12V5a1.5 1.5 0 113 0v12m-3-5a1.5 1.5 0 003 0m0 0V8a1.5 1.5 0 113 0v8m-3-8a1.5 1.5 0 003 0m0 0v2a1.5 1.5 0 113 0v6m-3-6a1.5 1.5 0 003 0M6 10.5a2.5 2.5 0 005 0V4.5a2.5 2.5 0 00-5 0v6z" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-black dark:group-hover:text-white text-center">Seeding</span>
          </Link>

          <Link 
            href={`/admin/events/${id}/pools`}
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-black dark:hover:border-white transition-all group"
          >
            <svg className="w-8 h-8 mb-3 text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-black dark:group-hover:text-white text-center">Pools</span>
          </Link>

          <Link 
            href={`/admin/events/${id}/scores`}
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-black dark:hover:border-white transition-all group"
          >
            <svg className="w-8 h-8 mb-3 text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-black dark:group-hover:text-white text-center">Scores</span>
          </Link>

          <Link 
            href={`/admin/events/${id}/bracket`}
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-black dark:hover:border-white transition-all group"
          >
            <svg className="w-8 h-8 mb-3 text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-black dark:group-hover:text-white text-center">Bracket</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content: Divisions */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter">Divisions</h2>
                <Link 
                  href={`/admin/events/${id}/divisions/new`}
                  className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity uppercase text-xs tracking-tighter"
                >
                  + Add Division
                </Link>
              </div>

              {event.divisions && event.divisions.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {event.divisions.map((division: Division) => (
                    <div key={division.id} className="p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-between group hover:shadow-md transition-all">
                      <div>
                        <h4 className="font-black text-black dark:text-white uppercase tracking-tight">{division.name}</h4>
                        <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">
                          {division.level} • {division.format_type} • {division.team_cap} Teams
                        </p>
                      </div>
                      <Link 
                        href={`/admin/events/${id}/divisions/${division.id}/edit`}
                        className="text-zinc-300 group-hover:text-black dark:group-hover:text-white transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 border-2 border-dashed border-zinc-200 dark:border-zinc-900 rounded-3xl text-center bg-zinc-50/50 dark:bg-zinc-950/50">
                  <p className="text-zinc-500 font-bold">No divisions created yet.</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar: Quick Actions / Stats */}
          <div className="space-y-8">
            <QRCodeDownloader url={publicUrl} eventName={event.name} />
            
            <div className="p-8 bg-black text-white dark:bg-white dark:text-black rounded-3xl shadow-xl">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 opacity-60">Event Stats</h3>
               <div className="space-y-6">
                  <div>
                    <p className="text-2xl font-black uppercase tracking-tighter">{totalTeams}</p>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-60 mt-1">Total Teams</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black uppercase tracking-tighter">${totalRevenue.toFixed(2)}</p>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-60 mt-1">Total Revenue</p>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-6">Tournament Tools</h3>
              <div className="grid grid-cols-1 gap-3">
                 <Link 
                   href={`/admin/events/${id}/registrations`}
                   className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-bold rounded-xl text-left text-sm uppercase tracking-tighter hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                 >
                    Manage Teams
                 </Link>
                 <Link 
                   href={`/admin/events/${id}/check-in`}
                   className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-bold rounded-xl text-left text-sm uppercase tracking-tighter hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                 >
                    Event Check-In
                 </Link>
                 <Link 
                   href={`/admin/events/${id}/seeding`}
                   className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-bold rounded-xl text-left text-sm uppercase tracking-tighter hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                 >
                    Seeding Interface
                 </Link>
                 <Link 
                   href={`/admin/events/${id}/pools`}
                   className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-bold rounded-xl text-left text-sm uppercase tracking-tighter hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                 >
                    Pool Assignments
                 </Link>
                 <Link 
                   href={`/admin/events/${id}/scores`}
                   className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-bold rounded-xl text-left text-sm uppercase tracking-tighter hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                 >
                    Score Entry
                 </Link>
                 <Link 
                   href={`/admin/events/${id}/bracket`}
                   className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-bold rounded-xl text-left text-sm uppercase tracking-tighter hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                 >
                    Bracket Control
                 </Link>
                 <Link 
                   href={`/admin/events/${id}/announcements`}
                   className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-bold rounded-xl text-left text-sm uppercase tracking-tighter hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                 >
                    Post Announcement
                 </Link>
                 <Link 
                   href={`/admin/events/${id}/sponsors`}
                   className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-bold rounded-xl text-left text-sm uppercase tracking-tighter hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                 >
                    Manage Sponsors
                 </Link>
                 <button disabled className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 text-zinc-400 font-bold rounded-xl text-left text-sm uppercase tracking-tighter opacity-50 cursor-not-allowed">
                    Pool Assignments
                 </button>
                 <button disabled className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 text-zinc-400 font-bold rounded-xl text-left text-sm uppercase tracking-tighter opacity-50 cursor-not-allowed">
                    Bracket Control
                 </button>
                 <button disabled className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 text-zinc-400 font-bold rounded-xl text-left text-sm uppercase tracking-tighter opacity-50 cursor-not-allowed">
                    Score Entry
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
