'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPools(eventId: string, divisionId: string, poolData: { name: string, teamIds: string[] }[]) {
  const supabase = await createClient()

  // 1. Delete existing pools for this division (cascade deletes assignments)
  const { error: deleteError } = await supabase
    .from('pools')
    .delete()
    .eq('division_id', divisionId)

  if (deleteError) throw new Error(deleteError.message)

  // 2. Create new pools and assignments
  for (let i = 0; i < poolData.length; i++) {
    const { name, teamIds } = poolData[i]
    
    const { data: pool, error: poolError } = await supabase
      .from('pools')
      .insert([{ division_id: divisionId, name, display_order: i }])
      .select()
      .single()

    if (poolError) throw new Error(poolError.message)

    const assignments = teamIds.map((teamId, index) => ({
      pool_id: pool.id,
      team_id: teamId,
      seed: index + 1
    }))

    const { error: assignError } = await supabase
      .from('pool_assignments')
      .insert(assignments)

    if (assignError) throw new Error(assignError.message)
  }

  revalidatePath(`/admin/events/${eventId}/pools`)
}

export async function clearPools(eventId: string, divisionId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('pools')
    .delete()
    .eq('division_id', divisionId)

  if (error) throw new Error(error.message)

  revalidatePath(`/admin/events/${eventId}/pools`)
}

export async function generatePoolMatches(eventId: string, divisionId: string) {
  const supabase = await createClient()

  // 1. Get all pools and their assignments for this division
  const { data: pools, error: poolsError } = await supabase
    .from('pools')
    .select('*, assignments:pool_assignments(*)')
    .eq('division_id', divisionId)

  if (poolsError) throw new Error(poolsError.message)

  // 2. For each pool, generate round-robin matches
  const allMatches = []

  for (const pool of pools) {
    const teamIds = pool.assignments.map((a: any) => a.team_id)
    const courtNumber = (pool.display_order !== undefined ? pool.display_order + 1 : 1).toString()
    
    // Generate all unique pairs
    for (let i = 0; i < teamIds.length; i++) {
      for (let j = i + 1; j < teamIds.length; j++) {
        allMatches.push({
          division_id: divisionId,
          pool_id: pool.id,
          team_1_id: teamIds[i],
          team_2_id: teamIds[j],
          stage_type: 'pool' as const,
          status: 'upcoming' as const,
          court: courtNumber
        })
      }
    }
  }

  if (allMatches.length === 0) return

  // 3. Clear existing pool matches for this division first
  const { error: deleteError } = await supabase
    .from('matches')
    .delete()
    .eq('division_id', divisionId)
    .eq('stage_type', 'pool')

  if (deleteError) throw new Error(deleteError.message)

  // 4. Insert new matches
  const { error: insertError } = await supabase
    .from('matches')
    .insert(allMatches)

  if (insertError) throw new Error(insertError.message)

  revalidatePath(`/admin/events/${eventId}/pools`)
}

export async function clearPoolMatches(eventId: string, divisionId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('matches')
    .delete()
    .eq('division_id', divisionId)
    .eq('stage_type', 'pool')

  if (error) throw new Error(error.message)

  revalidatePath(`/admin/events/${eventId}/pools`)
}

export async function updateMatchScore(eventId: string, matchId: string, team1Score: number, team2Score: number, court?: string) {
  const supabase = await createClient()

  // Get current match to find team IDs
  const { data: match } = await supabase
    .from('matches')
    .select('team_1_id, team_2_id')
    .eq('id', matchId)
    .single()

  const winner_team_id = team1Score > team2Score ? match?.team_1_id : match?.team_2_id

  const updateData: any = {
    team_1_score: team1Score,
    team_2_score: team2Score,
    status: 'final',
    winner_team_id: team1Score !== team2Score ? winner_team_id : null,
    updated_at: new Date().toISOString()
  }

  if (court !== undefined) {
    updateData.court = court
  }

  const { error } = await supabase
    .from('matches')
    .update(updateData)
    .eq('id', matchId)

  if (error) throw new Error(error.message)

  revalidatePath(`/admin/events/${eventId}/scores`)
  revalidatePath(`/admin/events/${eventId}/pools`)
}
