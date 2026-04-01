import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CheckInInterface from '@/components/admin/CheckInInterface'
import { Team, Division } from '@/types'

export default async function CheckInPage({
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

  const { data: teams } = await supabase
    .from('teams')
    .select('*, division:divisions(*), check_ins(*)')
    .in('division_id', (divisions || []).map(d => d.id))
    .order('team_name')

  return (
    <div className="p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-4">
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
                Tournament Check-In
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs">
                {event.name} • Morning of Event
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
             <div className="px-6 py-3 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex flex-col justify-center">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Progress</p>
                <p className="text-xl font-black text-black dark:text-white tracking-tighter">
                   {teams?.filter(t => t.check_ins?.length > 0).length || 0} / {teams?.length || 0}
                </p>
             </div>
          </div>
        </header>

        <CheckInInterface 
          eventId={id}
          initialTeams={(teams as unknown) as (Team & { check_ins: any[] })[]}
          divisions={(divisions as unknown) as Division[]}
        />
      </div>
    </div>
  )
}
