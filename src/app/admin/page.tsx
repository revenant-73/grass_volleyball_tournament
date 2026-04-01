import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

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
            <button className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity">
              + New Event
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-4">Total Events</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-black dark:text-white">0</span>
            </div>
          </div>
          
          <div className="p-8 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-4">Total Teams</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-black dark:text-white">0</span>
            </div>
          </div>

          <div className="p-8 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-4">Gross Revenue</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-black dark:text-white">$0</span>
            </div>
          </div>
        </div>

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
           <button className="mt-10 px-10 py-4 bg-black text-white dark:bg-white dark:text-black font-black rounded-xl hover:opacity-90 transition-opacity uppercase tracking-tighter">
              Launch First Event
           </button>
        </div>
      </div>
    </div>
  )
}
