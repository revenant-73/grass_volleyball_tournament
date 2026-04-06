import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import BracketManager from '@/components/admin/BracketManager'
import { Match, Team, Division } from '@/types'

export default async function AdminBracketPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (eventError || !event) {
    notFound()
  }

  const { data: divisions } = await supabase
    .from('divisions')
    .select('*')
    .eq('event_id', id)
    .order('name')

  const { data: matches } = await supabase
    .from('matches')
    .select('*, team_1:teams!team_1_id(*), team_2:teams!team_2_id(*)')
    .in('division_id', (divisions || []).map(d => d.id))
    .eq('stage_type', 'bracket')
    .order('bracket_round', { ascending: true })
    .order('round_number', { ascending: true })

  const { data: allTeams } = await supabase
    .from('teams')
    .select('*')
    .in('division_id', (divisions || []).map(d => d.id))
    .eq('status', 'paid')

  return (
    <div className="p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex items-center gap-4 pb-8 border-b border-zinc-200 dark:border-zinc-800">
          <Link 
            href={`/admin/events/${id}`}
            className="p-2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter">
              Bracket Management
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs">
              {event.name} • Elimination Rounds
            </p>
          </div>
        </header>

        <BracketManager 
          eventId={id}
          initialMatches={(matches as unknown) as Match[]}
          divisions={(divisions as unknown) as Division[]}
          allTeams={(allTeams as unknown) as Team[]}
        />
      </div>
    </div>
  )
}
