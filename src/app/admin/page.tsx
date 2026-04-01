import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-12 pb-8 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">Admin Dashboard</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Logged in as {user.email}</p>
          </div>

          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="px-6 py-2 bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white font-semibold rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              Sign Out
            </button>
          </form>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">Events</h3>
            <p className="text-3xl font-black text-black dark:text-white">0</p>
            <p className="text-sm text-zinc-500 mt-2">Active tournaments</p>
          </div>
          
          <div className="p-8 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">Teams</h3>
            <p className="text-3xl font-black text-black dark:text-white">0</p>
            <p className="text-sm text-zinc-500 mt-2">Across all divisions</p>
          </div>

          <div className="p-8 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">Revenue</h3>
            <p className="text-3xl font-black text-black dark:text-white">$0.00</p>
            <p className="text-sm text-zinc-500 mt-2">This month</p>
          </div>
        </div>

        <div className="mt-12 p-12 border-2 border-dashed border-zinc-200 dark:border-zinc-900 rounded-2xl flex flex-col items-center justify-center text-center">
           <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
           </div>
           <h2 className="text-xl font-bold text-black dark:text-white">No events found</h2>
           <p className="text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm">You haven't created any events yet. Get started by creating your first tournament.</p>
           <button className="mt-8 px-8 py-3 bg-black text-white dark:bg-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity">
              Create Event
           </button>
        </div>
      </div>
    </div>
  )
}
