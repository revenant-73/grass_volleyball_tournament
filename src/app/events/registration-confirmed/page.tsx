import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function RegistrationConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ teamId: string }>
}) {
  const { teamId } = await searchParams
  if (!teamId) notFound()

  const supabase = await createClient()

  const { data: team, error } = await supabase
    .from('teams')
    .select(`
      *,
      division:divisions (
        *,
        event:events (*)
      )
    `)
    .eq('id', teamId)
    .single()

  if (error || !team) {
    notFound()
  }

  const event = team.division.event
  const division = team.division

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8 lg:p-12">
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-12 inline-flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-[2.5rem] shadow-inner">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-4xl lg:text-6xl font-black text-black dark:text-white uppercase tracking-tighter mb-4 leading-tight">
          {team.status === 'waitlisted' ? 'Waitlist Confirmed!' : 'Registration Confirmed!'}
        </h1>
        <p className="text-xl font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight mb-12">
          {team.team_name} is all set for {event.name}
        </p>

        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[3rem] p-10 shadow-xl text-left space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Division</p>
              <p className="text-xl font-black text-black dark:text-white uppercase tracking-tighter">{division.name}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Status</p>
              <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${
                team.status === 'paid' ? 'bg-green-500 text-white' : 
                team.status === 'waitlisted' ? 'bg-amber-500 text-white' : 
                'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
              }`}>
                {team.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Captain</p>
              <p className="font-bold text-black dark:text-white">{team.captain_name}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Partner</p>
              <p className="font-bold text-black dark:text-white">{team.partner_name}</p>
            </div>
          </div>

          <div className="pt-10 border-t border-zinc-100 dark:border-zinc-900">
             <h3 className="text-xs font-black text-black dark:text-white uppercase tracking-widest mb-4">Next Steps</h3>
             <ul className="space-y-4">
               {[
                 'Check your email for a confirmation message.',
                 team.status === 'waitlisted' ? 'We will notify you if a spot opens up.' : 'Show up at Seaside Park at 08:00 AM for check-in.',
                 'Make sure your partner is ready to play!'
               ].map((step, i) => (
                 <li key={i} className="flex gap-4 items-start">
                   <span className="flex-shrink-0 w-6 h-6 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center text-[10px] font-black">{i + 1}</span>
                   <p className="text-zinc-500 dark:text-zinc-400 font-bold">{step}</p>
                 </li>
               ))}
             </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            href={`/events/${event.slug}`}
            className="w-full sm:w-auto px-10 py-5 bg-black text-white dark:bg-white dark:text-black font-black rounded-2xl hover:opacity-90 transition-opacity uppercase tracking-tighter shadow-xl"
          >
            Back to Event Page
          </Link>
          <button className="w-full sm:w-auto px-10 py-5 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-black dark:hover:text-white font-black rounded-2xl transition-all uppercase tracking-tighter">
             Share with Partner
          </button>
        </div>
      </div>
    </div>
  )
}
