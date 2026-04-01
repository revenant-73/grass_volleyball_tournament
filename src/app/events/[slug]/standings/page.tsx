import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import TournamentNav from '@/components/public/TournamentNav'
import PublicStandingsView from '@/components/public/PublicStandingsView'
import { Match, Team, Division, Pool } from '@/types'

export default async function PublicStandingsPage({
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

  const divisionIds = event.divisions.map((d: any) => d.id)

  const { data: teams } = await supabase
    .from('teams')
    .select('*')
    .in('division_id', divisionIds)
    .eq('status', 'paid')

  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .in('division_id', divisionIds)
    .eq('stage_type', 'pool')

  const { data: pools } = await supabase
    .from('pools')
    .select('*')
    .in('division_id', divisionIds)
    .order('display_order', { ascending: true })

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <TournamentNav slug={slug} eventName={event.name} />
        
        <PublicStandingsView 
          divisions={event.divisions}
          teams={(teams as unknown) as Team[]}
          matches={(matches as unknown) as Match[]}
          pools={(pools as unknown) as Pool[]}
        />
      </div>
    </div>
  )
}
