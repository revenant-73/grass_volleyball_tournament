'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { calculateStandings, rankTeamsAcrossPools, generateSingleElimBracket } from '@/lib/tournament-logic'
import { Match } from '@/types'

export async function generateBracket(eventId: string, divisionId: string, teamsToAdvance: number) {
  const supabase = await createClient()

  // 1. Get all matches and teams for standings
  const { data: teams } = await supabase.from('teams').select('*').eq('division_id', divisionId).eq('status', 'paid')
  const { data: matches } = await supabase.from('matches').select('*').eq('division_id', divisionId).eq('stage_type', 'pool')

  if (!teams || !matches) throw new Error('Data not found')

  const standings = calculateStandings(teams, matches)
  const rankedTeams = rankTeamsAcrossPools(standings).slice(0, teamsToAdvance)

  // 2. Clear existing bracket matches
  const { error: deleteError } = await supabase
    .from('matches')
    .delete()
    .eq('division_id', divisionId)
    .eq('stage_type', 'bracket')

  if (deleteError) throw new Error(deleteError.message)

  // 3. Generate new bracket matches
  const bracketMatches = generateSingleElimBracket(divisionId, rankedTeams)

  if (bracketMatches.length > 0) {
    const { error: insertError } = await supabase
      .from('matches')
      .insert(bracketMatches)

    if (insertError) throw new Error(insertError.message)
  }

  revalidatePath(`/admin/events/${eventId}/bracket`)
}

export async function updateBracketScore(
  eventId: string, 
  matchId: string, 
  s1_1: number, s1_2: number, 
  s2_1: number, s2_2: number, 
  s3_1: number, s3_2: number
) {
  const supabase = await createClient()

  // Get current match
  const { data: match } = await supabase
    .from('matches')
    .select('*')
    .eq('id', matchId)
    .single()

  if (!match) throw new Error('Match not found')

  const sets_won_1 = (s1_1 > s1_2 ? 1 : 0) + (s2_1 > s2_2 ? 1 : 0) + (s3_1 > s3_2 ? 1 : 0)
  const sets_won_2 = (s1_2 > s1_1 ? 1 : 0) + (s2_2 > s2_1 ? 1 : 0) + (s3_2 > s3_1 ? 1 : 0)

  const winnerId = sets_won_1 > sets_won_2 ? match.team_1_id : (sets_won_2 > sets_won_1 ? match.team_2_id : null)

  // 1. Update this match
  const { error: updateError } = await supabase
    .from('matches')
    .update({
      team_1_score: s1_1,
      team_2_score: s1_2,
      team_1_score_2: s2_1,
      team_2_score_2: s2_2,
      team_1_score_3: s3_1,
      team_2_score_3: s3_2,
      sets_won_1,
      sets_won_2,
      status: 'final',
      winner_team_id: winnerId,
      updated_at: new Date().toISOString()
    })
    .eq('id', matchId)

  if (updateError) throw new Error(updateError.message)

  // 2. Advance winner to next round
  // Logic: Round 1 Match 1 & 2 feed into Round 2 Match 1, etc.
  if (winnerId) {
    const nextRound = (match.bracket_round || 0) + 1
    const nextMatchNum = Math.ceil((match.round_number || 0) / 2)
    const isTeam1InNext = (match.round_number || 0) % 2 !== 0

    // Find if next match exists
    const { data: nextMatch } = await supabase
      .from('matches')
      .select('id')
      .eq('division_id', match.division_id)
      .eq('stage_type', 'bracket')
      .eq('bracket_round', nextRound)
      .eq('round_number', nextMatchNum)
      .single()

    if (nextMatch) {
      const updateData: any = {}
      if (isTeam1InNext) updateData.team_1_id = winnerId
      else updateData.team_2_id = winnerId

      await supabase
        .from('matches')
        .update(updateData)
        .eq('id', nextMatch.id)
    } else {
      // If no match exists, check if we need to create one (e.g. for Semis -> Finals)
      // For MVP, we usually pre-generate the whole structure or create on the fly.
      // Let's create on the fly for simplicity if it's not the final match.
      // Actually, for single elim 8 teams: 4 QF -> 2 SF -> 1 F.
      // If we are at QF (Round 1), we need SF (Round 2).
      // If we are at SF (Round 2), we need F (Round 3).
      
      // Let's check max round for this count
      const totalTeams = 8 // Hardcoded for now or derived from QF count
      const maxRounds = 3 

      if (nextRound <= maxRounds) {
         const { error: createError } = await supabase
           .from('matches')
           .insert([{
             division_id: match.division_id,
             stage_type: 'bracket',
             bracket_round: nextRound,
             round_number: nextMatchNum,
             [isTeam1InNext ? 'team_1_id' : 'team_2_id']: winnerId,
             status: 'upcoming'
           }])
         if (createError) console.error(createError)
      }
    }
  }

  revalidatePath(`/admin/events/${eventId}/bracket`)
}

export async function toggleBracketPublish(eventId: string, divisionId: string, publish: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('divisions')
    .update({ bracket_published: publish })
    .eq('id', divisionId)

  if (error) throw new Error(error.message)

  revalidatePath(`/admin/events/${eventId}/bracket`)
  revalidatePath(`/events/[slug]`, 'layout')
}

export async function updateBracketMatch(eventId: string, matchId: string, updates: Partial<Match>) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('matches')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', matchId)

  if (error) throw new Error(error.message)

  revalidatePath(`/admin/events/${eventId}/bracket`)
}

export async function updateBracketTeam(eventId: string, matchId: string, teamSlot: 1 | 2, teamId: string | null) {
  const supabase = await createClient()

  const updateData: any = {}
  if (teamSlot === 1) updateData.team_1_id = teamId
  else updateData.team_2_id = teamId

  const { error } = await supabase
    .from('matches')
    .update({
      ...updateData,
      updated_at: new Date().toISOString()
    })
    .eq('id', matchId)

  if (error) throw new Error(error.message)

  revalidatePath(`/admin/events/${eventId}/bracket`)
}
