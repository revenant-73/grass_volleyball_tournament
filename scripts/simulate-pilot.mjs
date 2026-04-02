import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function createPools(divisionId, teams) {
  console.log('--- Step 4: Create 2 Pools ---')
  const poolA = { division_id: divisionId, name: 'Pool A', display_order: 0 }
  const poolB = { division_id: divisionId, name: 'Pool B', display_order: 1 }

  const { data: createdPools, error: poolError } = await supabase
    .from('pools')
    .insert([poolA, poolB])
    .select()

  if (poolError) throw poolError
  console.log('Created 2 pools.')

  const assignments = []
  const poolMap = [0, 1, 1, 0, 0, 1, 1, 0]
  
  teams.forEach((team, i) => {
    assignments.push({
      pool_id: createdPools[poolMap[i]].id,
      team_id: team.id,
      seed: i + 1
    })
  })

  const { error: assignError } = await supabase
    .from('pool_assignments')
    .insert(assignments)

  if (assignError) throw assignError
  console.log('Assigned teams to pools.')
  return createdPools
}

async function generatePoolMatches(divisionId, pools) {
  console.log('--- Step 5: Generate Pool Matches ---')
  const { data: assignments } = await supabase
    .from('pool_assignments')
    .select('*')
    .in('pool_id', pools.map(p => p.id))

  const matches = []
  for (const pool of pools) {
    const poolTeams = assignments.filter(a => a.pool_id === pool.id).map(a => a.team_id)
    for (let i = 0; i < poolTeams.length; i++) {
      for (let j = i + 1; j < poolTeams.length; j++) {
        matches.push({
          division_id: divisionId,
          pool_id: pool.id,
          team_1_id: poolTeams[i],
          team_2_id: poolTeams[j],
          stage_type: 'pool',
          status: 'upcoming'
        })
      }
    }
  }

  const { data: createdMatches, error: matchError } = await supabase
    .from('matches')
    .insert(matches)
    .select()

  if (matchError) throw matchError
  console.log(`Generated ${createdMatches.length} pool matches.`)
  return createdMatches
}

async function simulatePoolScores(matches) {
  console.log('--- Step 6: Simulate Pool Scores ---')
  for (const match of matches) {
    let score1, score2
    if (match.team_1_id < match.team_2_id) {
       score1 = 21
       score2 = Math.floor(Math.random() * 15)
    } else {
       score1 = Math.floor(Math.random() * 15)
       score2 = 21
    }

    const { error } = await supabase
      .from('matches')
      .update({
        team_1_score: score1,
        team_2_score: score2,
        status: 'final',
        winner_team_id: score1 > score2 ? match.team_1_id : match.team_2_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', match.id)

    if (error) throw error
  }
  console.log('Simulated all pool scores.')
}

function calculateStandings(teams, matches) {
  const standingsMap = {}
  teams.forEach(t => {
    standingsMap[t.id] = { team: t, wins: 0, losses: 0, pointDiff: 0 }
  })

  matches.filter(m => m.status === 'final').forEach(m => {
    const t1 = standingsMap[m.team_1_id]
    const t2 = standingsMap[m.team_2_id]
    if (m.team_1_score > m.team_2_score) {
      t1.wins++
      t2.losses++
    } else {
      t2.wins++
      t1.losses++
    }
    t1.pointDiff += (m.team_1_score - m.team_2_score)
    t2.pointDiff += (m.team_2_score - m.team_1_score)
  })

  return Object.values(standingsMap).sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins
    return b.pointDiff - a.pointDiff
  })
}

async function generateBracket(divisionId) {
  console.log('--- Step 7: Generate Bracket ---')
  const { data: teams } = await supabase.from('teams').select('*').eq('division_id', divisionId).eq('status', 'paid')
  const { data: matches } = await supabase.from('matches').select('*').eq('division_id', divisionId).eq('stage_type', 'pool')

  const standings = calculateStandings(teams, matches)
  const rankedTeams = standings.map(s => s.team)

  // 1 vs 8, 4 vs 5, 2 vs 7, 3 vs 6
  const qfSeeds = [[0, 7], [3, 4], [1, 6], [2, 5]]
  const bracketMatches = qfSeeds.map((pair, i) => ({
    division_id: divisionId,
    stage_type: 'bracket',
    bracket_round: 1, // QF
    round_number: i + 1,
    team_1_id: rankedTeams[pair[0]]?.id || null,
    team_2_id: rankedTeams[pair[1]]?.id || null,
    status: 'upcoming'
  }))

  const { data: createdBracket, error } = await supabase
    .from('matches')
    .insert(bracketMatches)
    .select()

  if (error) throw error
  console.log(`Generated ${createdBracket.length} QF matches.`)
  return createdBracket
}

async function simulateBracketPlay(divisionId, qfMatches) {
  console.log('--- Step 8: Simulate Bracket Play ---')
  
  // 1. Quarters
  console.log('Playing Quarterfinals...')
  const winners = []
  for (const match of qfMatches) {
    const winnerId = match.team_1_id // Lower seed always wins for simplicity
    await supabase.from('matches').update({
      team_1_score: 21, team_2_score: 15, status: 'final', winner_team_id: winnerId
    }).eq('id', match.id)
    winners.push(winnerId)
  }

  // 2. Semis (Manual Advancement simulation)
  console.log('Generating & Playing Semifinals...')
  const sfMatches = [
    { division_id: divisionId, stage_type: 'bracket', bracket_round: 2, round_number: 1, team_1_id: winners[0], team_2_id: winners[1], status: 'upcoming' },
    { division_id: divisionId, stage_type: 'bracket', bracket_round: 2, round_number: 2, team_1_id: winners[2], team_2_id: winners[3], status: 'upcoming' }
  ]
  const { data: createdSF } = await supabase.from('matches').insert(sfMatches).select()
  
  const finalTeams = []
  for (const match of createdSF) {
    const winnerId = match.team_1_id
    await supabase.from('matches').update({
      team_1_score: 21, team_2_score: 15, status: 'final', winner_team_id: winnerId
    }).eq('id', match.id)
    finalTeams.push(winnerId)
  }

  // 3. Finals
  console.log('Generating & Playing Finals...')
  const { data: finalMatch } = await supabase.from('matches').insert([{
    division_id: divisionId, stage_type: 'bracket', bracket_round: 3, round_number: 1, team_1_id: finalTeams[0], team_2_id: finalTeams[1], status: 'upcoming'
  }]).select().single()

  await supabase.from('matches').update({
    team_1_score: 21, team_2_score: 19, status: 'final', winner_team_id: finalTeams[0]
  }).eq('id', finalMatch.id)

  console.log('Tournament complete! Winner: Team ' + finalTeams[0])
}

async function runSimulation(eventId, divisionId) {
  try {
    const { data: teams } = await supabase.from('teams').select('*').eq('division_id', divisionId).order('created_at')
    
    // Check if pools exist, if not create them
    const { data: existingPools } = await supabase.from('pools').select('*').eq('division_id', divisionId)
    let pools = existingPools
    if (pools.length === 0) {
      pools = await createPools(divisionId, teams)
      const poolMatches = await generatePoolMatches(divisionId, pools)
      await simulatePoolScores(poolMatches)
    }

    const qfMatches = await generateBracket(divisionId)
    await simulateBracketPlay(divisionId, qfMatches)

    console.log('--- ALL PHASES COMPLETE ---')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

const args = process.argv.slice(2)
const EVENT_ID = args[0]
const DIVISION_ID = args[1]

if (!EVENT_ID || !DIVISION_ID) {
  console.error('Usage: node scripts/simulate-pilot.mjs <EVENT_ID> <DIVISION_ID>')
  process.exit(1)
}

runSimulation(EVENT_ID, DIVISION_ID)
