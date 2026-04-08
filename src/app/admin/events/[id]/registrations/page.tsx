import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import TeamManagement from '@/components/admin/TeamManagement'
import { Team, Division } from '@/types'

export default async function RegistrationsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch event details
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (eventError || !event) {
    notFound()
  }

  // Fetch divisions for this event
  const { data: divisions, error: divisionsError } = await supabase
    .from('divisions')
    .select('*')
    .eq('event_id', id)
    .order('name')

  if (divisionsError) {
    console.error('Error fetching divisions:', divisionsError)
  }

  // Fetch teams with their division info
  const { data: teams, error: teamsError } = await supabase
    .from('teams')
    .select('*, division:divisions(*)')
    .in('division_id', (divisions || []).map(d => d.id))
    .order('created_at', { ascending: false })

  if (teamsError) {
    console.error('Error fetching teams:', teamsError)
  }

  return (
    <div className="p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 pb-8 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href={`/admin/events/${id}`}
              className="p-2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter">
              Team Registrations
            </h1>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 font-bold ml-12 uppercase tracking-widest text-xs">
            {event.name} • {teams?.length || 0} Registered Teams
          </p>
        </header>

        <TeamManagement 
          eventId={id} 
          eventSlug={event.slug}
          initialTeams={(teams as unknown) as Team[]} 
          divisions={(divisions as unknown) as Division[]} 
        />
      </div>
    </div>
  )
}
