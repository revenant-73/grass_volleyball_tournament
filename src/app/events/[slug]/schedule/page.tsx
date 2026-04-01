import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import TournamentNav from '@/components/public/TournamentNav'
import PublicScheduleView from '@/components/public/PublicScheduleView'
import { Match, Division } from '@/types'

export default async function PublicSchedulePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: event, error } = await supabase
    .from('events')
    .select(`
      *,
      divisions (*)
    `)
    .eq('slug', slug)
    .single()

  if (error || !event) {
    notFound()
  }

  const { data: matches } = await supabase
    .from('matches')
    .select('*, team_1:teams!team_1_id(*), team_2:teams!team_2_id(*), pool:pools(*)')
    .in('division_id', event.divisions.map((d: any) => d.id))
    .order('created_at', { ascending: true })

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <TournamentNav slug={slug} eventName={event.name} />
        
        <PublicScheduleView 
          divisions={event.divisions}
          initialMatches={(matches as unknown) as Match[]}
        />
      </div>
    </div>
  )
}
