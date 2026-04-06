import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import SeedingInterface from '@/components/admin/SeedingInterface'
import { Team, Division } from '@/types'

export default async function SeedingPage({
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

  const { data: divisions, error: divisionsError } = await supabase
    .from('divisions')
    .select('*')
    .eq('event_id', id)
    .order('name')

  if (divisionsError) {
    console.error('Divisions fetch error:', divisionsError)
    return (
      <div className="p-8">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h2 className="text-red-800 font-bold">Error loading divisions</h2>
          <p className="text-red-600 text-sm">{divisionsError.message}</p>
        </div>
      </div>
    )
  }

  const { data: teams, error: teamsError } = await supabase
    .from('teams')
    .select('*, division:divisions(*)')
    .in('division_id', (divisions || []).map(d => d.id))
    .eq('status', 'paid') // Only seed paid teams
    .order('manual_seed', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true })

  if (teamsError) {
    console.error('Teams fetch error:', teamsError)
    return (
      <div className="p-8">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h2 className="text-red-800 font-bold">Error loading teams</h2>
          <p className="text-red-600 text-sm">{teamsError.message}</p>
          <pre className="mt-2 text-xs bg-red-100 p-2 rounded">{JSON.stringify(teamsError, null, 2)}</pre>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
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
              Manual Seeding
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs">
              {event.name} • Order teams for pool distribution
            </p>
          </div>
        </header>

        <SeedingInterface 
          eventId={id}
          initialTeams={(teams as unknown) as Team[]}
          divisions={(divisions as unknown) as Division[]}
        />
      </div>
    </div>
  )
}
