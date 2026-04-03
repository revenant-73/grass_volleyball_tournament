import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function getMatchTeams(id) {
  const { data } = await supabase.from('matches').select('team_1_id, team_2_id').eq('id', id).single()
  return { t1: data.team_1_id, t2: data.team_2_id }
}

async function updateMatch(matchId, s1_1, s1_2, s2_1, s2_2, s3_1, s3_2) {
  // Now that the trigger is in place, we just need to update the raw scores.
  // The trigger will handle winner_team_id, sets_won, and status.
  const { error } = await supabase
    .from('matches')
    .update({
      team_1_score: s1_1,
      team_2_score: s1_2,
      team_1_score_2: s2_1,
      team_2_score_2: s2_2,
      team_1_score_3: s3_1,
      team_2_score_3: s3_2,
      updated_at: new Date().toISOString()
    })
    .eq('id', matchId)
  
  if (error) console.error(`Error updating match ${matchId}:`, error)
  else console.log(`Match ${matchId} updated: ${s1_1}-${s1_2}, ${s2_1}-${s2_2}, ${s3_1 > 0 || s3_2 > 0 ? s3_1 + '-' + s3_2 : '(2 sets)'}`)
}

async function run() {
  const eventId = '28e9d101-ae44-4f3f-8484-b19a841470dd'
  
  const { data: divisionData } = await supabase.from('divisions').select('id').eq('event_id', eventId).limit(1).single()
  if (!divisionData) {
    console.error('No division found for event');
    return;
  }
  const divisionId = divisionData.id;

  const { data: matches } = await supabase
    .from('matches')
    .select('id, stage_type')
    .eq('division_id', divisionId)
    .eq('stage_type', 'pool')
    .limit(5)

  if (matches) {
    // Pool match 1: Straight sets (21-15, 21-12)
    if (matches[0]) await updateMatch(matches[0].id, 21, 15, 21, 12, 0, 0)
    // Pool match 2: Three sets, close scores (21-19, 18-21, 15-13)
    if (matches[1]) await updateMatch(matches[1].id, 21, 19, 18, 21, 15, 13)
    // Pool match 3: Win by two extension (24-22, 21-19)
    if (matches[2]) await updateMatch(matches[2].id, 24, 22, 21, 19, 0, 0)
  }

  const { data: bracketMatches } = await supabase
    .from('matches')
    .select('id')
    .eq('division_id', divisionId)
    .eq('stage_type', 'bracket')
    .limit(1)

  if (bracketMatches && bracketMatches[0]) {
    // Bracket match: Three sets with extension (19-21, 21-14, 17-15)
    await updateMatch(bracketMatches[0].id, 19, 21, 21, 14, 17, 15)
  }
}

run()
