'use client'

import { useState } from 'react'
import { Division, Team, Match } from '@/types'
import { Card, CardContent } from '@/components/ui/card'

interface PublicBracketViewProps {
  divisions: Division[]
  teams: Team[]
  bracketMatches: Match[]
}

export default function PublicBracketView({
  divisions,
  teams,
  bracketMatches,
}: PublicBracketViewProps) {
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>(
    divisions[0]?.id || ''
  )

  const selectedDivision = divisions.find((d) => d.id === selectedDivisionId)
  const isPublished = selectedDivision?.bracket_published || false
  const divisionMatches = bracketMatches.filter(
    (m) => m.division_id === selectedDivisionId
  )
  
  const rounds = Array.from(
    new Set(divisionMatches.map((m) => m.bracket_round))
  ).sort((a, b) => (a || 0) - (b || 0))

  return (
    <div className="space-y-8">
      {/* Division Selector */}
      <div className="flex flex-wrap gap-2">
        {divisions.map((division) => (
          <button
            key={division.id}
            onClick={() => setSelectedDivisionId(division.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedDivisionId === division.id
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
            }`}
          >
            {division.name}
          </button>
        ))}
      </div>

      {!isPublished ? (
        <div className="py-24 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-500 font-medium">
            The bracket for this division hasn&apos;t been published yet.
          </p>
          <p className="text-zinc-400 text-sm mt-2">
            Check back once pool play has concluded!
          </p>
        </div>
      ) : divisionMatches.length === 0 ? (
        <div className="py-24 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-500 font-medium">
            No bracket matches generated for this division.
          </p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-start gap-8 overflow-x-auto pb-8 min-h-[400px]">
          {rounds.map((round) => (
            <div key={round} className="flex-1 min-w-[280px] space-y-6">
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] border-b border-zinc-100 dark:border-zinc-900 pb-4">
                {round === 1 ? 'Round 1' : round === 2 ? 'Semifinals' : round === 3 ? 'Finals' : `Round ${round}`}
              </h3>
              <div className="space-y-4">
                {divisionMatches
                  .filter((m) => m.bracket_round === round)
                  .map((match) => {
                    const team1 = teams.find(t => t.id === match.team_1_id)
                    const team2 = teams.find(t => t.id === match.team_2_id)
                    const isFinal = match.status === 'final'

                    return (
                      <Card key={match.id} className="border-zinc-200 dark:border-zinc-800 overflow-hidden">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center justify-between gap-4">
                            <span className={`font-bold text-sm truncate ${isFinal && match.winner_team_id === team1?.id ? 'text-emerald-600' : 'text-zinc-600 dark:text-zinc-300'}`}>
                              {team1?.team_name || 'TBD'}
                            </span>
                            <span className="font-mono font-black text-lg">
                              {match.team_1_score}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className={`font-bold text-sm truncate ${isFinal && match.winner_team_id === team2?.id ? 'text-emerald-600' : 'text-zinc-600 dark:text-zinc-300'}`}>
                              {team2?.team_name || 'TBD'}
                            </span>
                            <span className="font-mono font-black text-lg">
                              {match.team_2_score}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
