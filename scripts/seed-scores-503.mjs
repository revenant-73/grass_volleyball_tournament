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

async function updateMatch(matchId, s1_1, s1_2) {
  const teams = await getMatchTeams(matchId)
  const winner_id = s1_1 > s1_2 ? teams.t1 : (s1_2 > s1_1 ? teams.t2 : null)

  const { error } = await supabase
    .from('matches')
    .update({
      team_1_score: s1_1,
      team_2_score: s1_2,
      status: 'final',
      winner_team_id: winner_id,
      updated_at: new Date().toISOString()
    })
    .eq('id', matchId)
  
  if (error) console.error(`Error updating match ${matchId}:`, error)
  else console.log(`Match ${matchId} updated: ${s1_1}-${s1_2} (Single set for demo)`)
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
    if (matches[0]) await updateMatch(matches[0].id, 21, 15)
    if (matches[1]) await updateMatch(matches[1].id, 21, 19)
    if (matches[2]) await updateMatch(matches[2].id, 10, 21)
  }

  const { data: bracketMatches } = await supabase
    .from('matches')
    .select('id')
    .eq('division_id', divisionId)
    .eq('stage_type', 'bracket')
    .limit(1)

  if (bracketMatches && bracketMatches[0]) {
    await updateMatch(bracketMatches[0].id, 21, 10)
  }
}

run()
