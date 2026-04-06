import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Event } from '@/types'

export default async function Home() {
  const supabase = await createClient()

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .neq('status', 'draft')
    .order('date_start', { ascending: true })
    .limit(3)

  if (error) {
    console.error('Error fetching events:', error)
  }

  const upcomingEvents = events?.filter(e => new Date(e.date_start) >= new Date(new Date().setHours(0,0,0,0))) || []

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-black pt-16">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-white dark:bg-black py-20">
          <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-50 dark:to-black" />
            <div className="h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:24px_24px]" />
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8">
            <h1 className="text-5xl sm:text-8xl font-black tracking-tighter text-black dark:text-white uppercase leading-[0.9] break-words">
              Find your next <br />
              <span className="text-coral">tournament</span>
            </h1>
            <p className="max-w-xl mx-auto text-lg sm:text-xl font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
              The premier platform for grass doubles volleyball participants and directors.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 w-full max-w-sm mx-auto sm:max-w-none">
              <Link href="/events" className="w-full sm:w-auto px-8 sm:px-12 py-5 bg-coral text-white text-lg font-black uppercase tracking-tighter rounded-2xl hover:scale-105 transition-transform shadow-2xl text-center">
                Explore Events
              </Link>
              <Link href="#directors" className="w-full sm:w-auto px-8 sm:px-12 py-5 border-2 border-zinc-200 dark:border-zinc-800 text-black dark:text-white text-lg font-black uppercase tracking-tighter rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-center">
                Run a Tournament
              </Link>
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        {upcomingEvents.length > 0 && (
          <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
              <div className="space-y-2">
                <h2 className="text-sm font-black text-coral uppercase tracking-[0.2em]">Next up</h2>
                <h3 className="text-3xl sm:text-4xl font-black text-black dark:text-white uppercase tracking-tighter">Featured Tournaments</h3>
              </div>
              <Link href="/events" className="text-xs font-black text-zinc-400 hover:text-black dark:hover:text-white uppercase tracking-widest transition-colors pb-2">
                View all scheduled events &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    <h4 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter mb-4 line-clamp-2">
                      {event.name}
                    </h4>
                    <div className="mt-auto flex items-start gap-2 text-zinc-500 dark:text-zinc-400">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm font-bold">{event.location_name}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-12 text-center sm:hidden">
              <Link href="/events" className="text-sm font-black text-zinc-400 hover:text-black dark:hover:text-white uppercase tracking-widest transition-colors">
                View all events &rarr;
              </Link>
            </div>
          </section>
        )}

        {/* Features for Participants */}
        <section className="py-24 bg-zinc-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
              <div className="space-y-8">
                <h2 className="text-sm font-black text-zinc-500 uppercase tracking-[0.2em]">The Participant Experience</h2>
                <h3 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-[0.9]">Built for the <br /> modern player</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-coral text-white rounded-2xl flex items-center justify-center font-black text-sm sm:text-base">01</div>
                    <div>
                      <h4 className="font-black uppercase tracking-widest text-xs sm:text-sm mb-1">Live Mobile Brackets</h4>
                      <p className="text-zinc-400 font-bold text-sm">Follow scores, seedings, and tournament progress in real-time from your phone on the field.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-coral text-white rounded-2xl flex items-center justify-center font-black text-sm sm:text-base">02</div>
                    <div>
                      <h4 className="font-black uppercase tracking-widest text-xs sm:text-sm mb-1">Instant Registration</h4>
                      <p className="text-zinc-400 font-bold text-sm">Sign up with your partner in seconds. Integrated payments and digital waivers mean no more lines.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-coral text-white rounded-2xl flex items-center justify-center font-black text-sm sm:text-base">03</div>
                    <div>
                      <h4 className="font-black uppercase tracking-widest text-xs sm:text-sm mb-1">Live Notifications</h4>
                      <p className="text-zinc-400 font-bold text-sm">Stay informed with announcements directly from tournament directors during the event.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative aspect-square md:aspect-square bg-zinc-800 rounded-[2rem] sm:rounded-[3rem] overflow-hidden border border-zinc-700 shadow-2xl">
                 {/* Placeholder for a mobile screen mockup or action shot */}
                 <div className="absolute inset-0 flex items-center justify-center p-8 sm:p-12 opacity-30">
                    <svg className="w-full h-full text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-6 sm:p-8">
                       <p className="text-lg sm:text-xl font-black uppercase tracking-tighter mb-4 italic">No more &quot;Wait, what court are we on?&quot;</p>
                       <p className="text-[10px] sm:text-sm font-bold text-zinc-500 uppercase tracking-widest">Available on any mobile browser.</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Director Section */}
        <section id="directors" className="py-24 sm:py-32 bg-white dark:bg-black overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 text-center space-y-12">
            <h2 className="text-sm font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em]">For Tournament Directors</h2>
            <h3 className="text-4xl sm:text-7xl font-black uppercase tracking-tighter text-black dark:text-white leading-[0.9]">
              Less paperwork. <br /> More volleyball.
            </h3>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest leading-relaxed">
              Automate pool generation, score collection, and bracket progression. Give your participants a pro-level experience with zero extra effort.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 pt-8">
               <div className="flex flex-col items-center">
                  <span className="text-3xl sm:text-4xl font-black text-black dark:text-white mb-2 tracking-tighter">100%</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Mobile Management</span>
               </div>
               <div className="w-px h-12 bg-zinc-200 dark:bg-zinc-800 hidden sm:block"></div>
               <div className="flex flex-col items-center">
                  <span className="text-3xl sm:text-4xl font-black text-black dark:text-white mb-2 tracking-tighter">0</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Paper Scorecards</span>
               </div>
               <div className="w-px h-12 bg-zinc-200 dark:bg-zinc-800 hidden sm:block"></div>
               <div className="flex flex-col items-center">
                  <span className="text-3xl sm:text-4xl font-black text-black dark:text-white mb-2 tracking-tighter">Instant</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Pool Seedings</span>
               </div>
            </div>
            <div className="pt-12">
               <Link href="/login" className="inline-flex w-full sm:w-auto px-10 sm:px-12 py-5 bg-coral text-white text-lg font-black uppercase tracking-tighter rounded-2xl hover:opacity-90 transition-opacity text-center items-center justify-center">
                  Create Your First Event
               </Link>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-12 bg-zinc-50 dark:bg-black border-t border-zinc-200 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center gap-6">
          <div className="text-xl font-black uppercase tracking-tighter text-black dark:text-white">
            Grass Doubles
          </div>
          <div className="flex gap-8">
             <Link href="/events" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black dark:hover:text-white transition-colors">Tournaments</Link>
             <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black dark:hover:text-white transition-colors">Admin Login</Link>
             <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black dark:hover:text-white transition-colors">Support</Link>
          </div>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-8">
            &copy; {new Date().getFullYear()} Grass Doubles Tournament Platform. Built for the grass.
          </p>
        </div>
      </footer>
    </div>
  );
}
