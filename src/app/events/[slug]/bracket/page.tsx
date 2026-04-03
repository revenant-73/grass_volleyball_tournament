import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import TournamentNav from '@/components/public/TournamentNav'
import PublicBracketView from '@/components/public/PublicBracketView'
import { Match, Team, Division } from '@/types'

export default async function PublicBracketPage({
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

  const { data: bracketMatches } = await supabase
    .from('matches')
    .select('*')
    .in('division_id', divisionIds)
    .eq('stage_type', 'bracket')
    .order('bracket_round', { ascending: true })
    .order('round_number', { ascending: true })

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8 lg:p-12 pt-24 lg:pt-32">
      <div className="max-w-6xl mx-auto">
        <TournamentNav slug={slug} eventName={event.name} />
        
        <PublicBracketView 
          divisions={event.divisions}
          teams={(teams as unknown) as Team[]}
          bracketMatches={(bracketMatches as unknown) as Match[]}
        />
      </div>
    </div>
  )
}
