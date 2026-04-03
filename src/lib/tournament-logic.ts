import { Match, Team } from '@/types'

export interface TeamStanding {
  team: Team
  wins: number
  losses: number
  setsWon: number
  setsLost: number
  pointsFor: number
  pointsAgainst: number
  pointDiff: number
  winPercentage: number
}

export function calculateStandings(teams: Team[], matches: Match[]): TeamStanding[] {
  const standingsMap: Record<string, TeamStanding> = {}

  // Initialize standings for all teams
  teams.forEach(team => {
    standingsMap[team.id] = {
      team,
      wins: 0,
      losses: 0,
      setsWon: 0,
      setsLost: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      pointDiff: 0,
      winPercentage: 0
    }
  })

  // Process completed matches
  matches.filter(m => m.status === 'final').forEach(match => {
    const t1 = standingsMap[match.team_1_id!]
    const t2 = standingsMap[match.team_2_id!]

    if (!t1 || !t2) return

    // Points from all 3 sets
    const matchT1Points = (match.team_1_score || 0) + (match.team_1_score_2 || 0) + (match.team_1_score_3 || 0)
    const matchT2Points = (match.team_2_score || 0) + (match.team_2_score_2 || 0) + (match.team_2_score_3 || 0)

    t1.pointsFor += matchT1Points
    t1.pointsAgainst += matchT2Points
    t2.pointsFor += matchT2Points
    t2.pointsAgainst += matchT1Points

    // Sets Won
    t1.setsWon += (match.sets_won_1 || 0)
    t1.setsLost += (match.sets_won_2 || 0)
    t2.setsWon += (match.sets_won_2 || 0)
    t2.setsLost += (match.sets_won_1 || 0)

    // Match Wins
    if (match.sets_won_1 > match.sets_won_2) {
      t1.wins += 1
      t2.losses += 1
    } else if (match.sets_won_2 > match.sets_won_1) {
      t2.wins += 1
      t1.losses += 1
    }
  })

  // Calculate differentials and percentages
  const standings = Object.values(standingsMap).map(s => {
    const total = s.wins + s.losses
    return {
      ...s,
      pointDiff: s.pointsFor - s.pointsAgainst,
      winPercentage: total > 0 ? s.wins / total : 0
    }
  })

  // Sort by Wins -> Set Diff -> Point Diff -> Points For
  return standings.sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins
    
    const aSetDiff = a.setsWon - a.setsLost
    const bSetDiff = b.setsWon - b.setsLost
    if (bSetDiff !== aSetDiff) return bSetDiff - aSetDiff
    
    if (b.pointDiff !== a.pointDiff) return b.pointDiff - a.pointDiff
    return b.pointsFor - a.pointsFor
  })
}

export function rankTeamsAcrossPools(allStandings: TeamStanding[]): Team[] {
  // Simple ranking: take top teams from each pool, then second teams, etc.
  // Or just sort everyone by wins/diff if pools are balanced.
  // For now, let's just sort the combined list.
  return [...allStandings]
    .sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins
      
      const aSetDiff = a.setsWon - a.setsLost
      const bSetDiff = b.setsWon - b.setsLost
      if (bSetDiff !== aSetDiff) return bSetDiff - aSetDiff
      
      if (b.pointDiff !== a.pointDiff) return b.pointDiff - a.pointDiff
      return b.pointsFor - a.pointsFor
    })
    .map(s => s.team)
}

export function generateSingleElimBracket(divisionId: string, rankedTeams: Team[]) {
  const matches: any[] = []
  const count = rankedTeams.length

  if (count < 4) return []

  if (count >= 8) {
    // Quarterfinals (Round 1)
    // 1 vs 8, 4 vs 5, 2 vs 7, 3 vs 6
    const qfSeeds = [[0, 7], [3, 4], [1, 6], [2, 5]]
    qfSeeds.forEach((pair, i) => {
      matches.push({
        division_id: divisionId,
        stage_type: 'bracket',
        bracket_round: 1, // Quarters
        round_number: i + 1,
        team_1_id: rankedTeams[pair[0]]?.id || null,
        team_2_id: rankedTeams[pair[1]]?.id || null,
        status: 'upcoming'
      })
    })
  } else {
    // Semifinals (Round 1 if 4 teams)
    // 1 vs 4, 2 vs 3
    const sfSeeds = [[0, 3], [1, 2]]
    sfSeeds.forEach((pair, i) => {
      matches.push({
        division_id: divisionId,
        stage_type: 'bracket',
        bracket_round: 1, // Semis
        round_number: i + 1,
        team_1_id: rankedTeams[pair[0]]?.id || null,
        team_2_id: rankedTeams[pair[1]]?.id || null,
        status: 'upcoming'
      })
    })
  }

  return matches
}
