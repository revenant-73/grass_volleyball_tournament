import Link from 'next/link'
import { createEvent } from './actions'

export default function NewEventPage() {
  return (
    <div className="p-8 lg:p-12">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 pb-8 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/admin/events"
              className="p-2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter">
              Create New Event
            </h1>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 font-bold ml-12">
            Set up the core details for your tournament.
          </p>
        </header>

        <form action={createEvent} className="space-y-12">
          {/* Section 1: Basic Info */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="name">
                  Event Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Seaside Grass Doubles Open"
                  className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="slug">
                  URL Slug (Optional)
                </label>
                <div className="flex items-center">
                  <span className="px-4 py-4 bg-zinc-50 dark:bg-zinc-800 border-2 border-r-0 border-zinc-100 dark:border-zinc-800 rounded-l-xl text-zinc-400 text-sm font-bold">
                    /events/
                  </span>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    placeholder="seaside-open-2026"
                    className="flex-1 px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-r-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                  />
                </div>
                <p className="mt-2 text-xs text-zinc-400 font-bold italic ml-1">Leave empty to auto-generate from name.</p>
              </div>

              <div>
                <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Tell players about the tournament, rules, prizes, etc."
                  className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Date and Time */}
          <div className="pt-12 border-t border-zinc-100 dark:border-zinc-900">
            <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter mb-8">Scheduling</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="date_start">
                  Start Date *
                </label>
                <input
                  id="date_start"
                  name="date_start"
                  type="date"
                  required
                  className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="date_end">
                  End Date (Optional)
                </label>
                <input
                  id="date_end"
                  name="date_end"
                  type="date"
                  className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="check_in_time">
                  Check-in Time
                </label>
                <input
                  id="check_in_time"
                  name="check_in_time"
                  type="time"
                  className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="start_time">
                  First Serve Time
                </label>
                <input
                  id="start_time"
                  name="start_time"
                  type="time"
                  className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Location */}
          <div className="pt-12 border-t border-zinc-100 dark:border-zinc-900">
            <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter mb-8">Location</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="location_name">
                  Venue Name
                </label>
                <input
                  id="location_name"
                  name="location_name"
                  type="text"
                  placeholder="e.g. Seaside Park"
                  className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="location_address">
                  Full Address
                </label>
                <input
                  id="location_address"
                  name="location_address"
                  type="text"
                  placeholder="e.g. 123 Ocean Blvd, Beach City, CA"
                  className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                />
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-zinc-100 dark:border-zinc-900 flex justify-end gap-4">
             <Link 
               href="/admin/events"
               className="px-8 py-4 bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white font-black rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors uppercase tracking-tighter"
             >
                Cancel
             </Link>
             <button
               type="submit"
               className="px-12 py-4 bg-black text-white dark:bg-white dark:text-black font-black rounded-xl hover:opacity-90 transition-opacity uppercase tracking-tighter"
             >
                Create Event
             </button>
          </div>
        </form>
      </div>
    </div>
  )
}
