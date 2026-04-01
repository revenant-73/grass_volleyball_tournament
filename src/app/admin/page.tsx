import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch stats
  const { count: totalEvents } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })

  const { count: totalTeams } = await supabase
    .from('teams')
    .select('*', { count: 'exact', head: true })

  const { data: recentEvents } = await supabase
    .from('events')
    .select(`
      *,
      divisions (count)
    `)
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <div className="p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 pb-8 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter">
                Overview
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 font-bold mt-1">
                Signed in as <span className="text-black dark:text-white">{user.email}</span>
              </p>
            </div>
            <Link 
              href="/admin/events/new"
              className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              + New Event
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-4">Total Events</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-black dark:text-white">{totalEvents ?? 0}</span>
            </div>
          </div>
          
          <div className="p-8 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-4">Total Teams</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-black dark:text-white">{totalTeams ?? 0}</span>
            </div>
          </div>

          <div className="p-8 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-4">Gross Revenue</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-black dark:text-white">$0</span>
            </div>
          </div>
        </div>

        {recentEvents && recentEvents.length > 0 ? (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter">Recent Events</h2>
              <Link href="/admin/events" className="text-sm font-bold text-zinc-400 hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest">
                View All &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {recentEvents.map((event) => (
                <Link 
                  key={event.id}
                  href={`/admin/events/${event.id}`}
                  className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center font-black text-zinc-400 uppercase tracking-tighter text-xs">
                      {new Date(event.date_start).toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                    <div>
                      <h3 className="font-black text-black dark:text-white uppercase tracking-tighter group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                        {event.name}
                      </h3>
                      <p className="text-xs text-zinc-500 font-bold italic">{event.location_name}</p>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Status</p>
                    <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-900 rounded text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                      {event.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-12 p-16 border-2 border-dashed border-zinc-200 dark:border-zinc-900 rounded-3xl flex flex-col items-center justify-center text-center bg-white/50 dark:bg-zinc-950/50">
             <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-8">
                <svg className="w-10 h-10 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
             </div>
             <h2 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter">Your tournament list is empty</h2>
             <p className="text-zinc-500 dark:text-zinc-400 mt-3 max-w-sm font-bold">
                Ready to host? Create your first event and start accepting registrations today.
             </p>
             <Link 
               href="/admin/events/new"
               className="mt-10 px-10 py-4 bg-black text-white dark:bg-white dark:text-black font-black rounded-xl hover:opacity-90 transition-opacity uppercase tracking-tighter"
             >
                Launch First Event
             </Link>
          </div>
        )}
      </div>
    </div>
  )
}
