'use client'

import { useState } from 'react'
import { Division, Team, Match, Pool } from '@/types'
import { calculateStandings } from '@/lib/tournament-logic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PublicStandingsViewProps {
  divisions: Division[]
  teams: Team[]
  matches: Match[]
  pools: Pool[]
}

export default function PublicStandingsView({
  divisions,
  teams,
  matches,
  pools,
}: PublicStandingsViewProps) {
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>(
    divisions[0]?.id || ''
  )

  const divisionPools = pools.filter((p) => p.division_id === selectedDivisionId)
  const divisionTeams = teams.filter((t) => t.division_id === selectedDivisionId)
  const divisionMatches = matches.filter((m) => m.division_id === selectedDivisionId)

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {divisionPools.length > 0 ? (
          divisionPools.map((pool) => {
            const poolTeams = divisionTeams.filter((t) => t.pool_id === pool.id)
            const poolMatches = divisionMatches.filter((m) => m.pool_id === pool.id)
            const standings = calculateStandings(poolTeams, poolMatches)

            return (
              <Card key={pool.id} className="border-zinc-200 dark:border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-bold">
                    Pool {pool.name}
                  </CardTitle>
                  <Badge variant="outline" className="uppercase">
                    {poolTeams.length} Teams
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-zinc-100 dark:border-zinc-800">
                          <th className="text-left py-3 font-semibold text-zinc-500">Team</th>
                          <th className="text-center py-3 font-semibold text-zinc-500">W-L</th>
                          <th className="text-center py-3 font-semibold text-zinc-500">Diff</th>
                          <th className="text-center py-3 font-semibold text-zinc-500">Pts For</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {standings.map((stat, idx) => (
                          <tr key={stat.team_id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <span className="text-zinc-400 w-4 font-mono text-xs">{idx + 1}</span>
                                <span className="font-medium">{stat.team_name}</span>
                              </div>
                            </td>
                            <td className="text-center py-4 font-mono">
                              {stat.wins}-{stat.losses}
                            </td>
                            <td className={`text-center py-4 font-mono ${stat.point_diff > 0 ? 'text-emerald-600' : stat.point_diff < 0 ? 'text-rose-600' : ''}`}>
                              {stat.point_diff > 0 ? `+${stat.point_diff}` : stat.point_diff}
                            </td>
                            <td className="text-center py-4 text-zinc-500 font-mono">
                              {stat.points_for}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="lg:col-span-2 py-12 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500">No pools created yet for this division.</p>
          </div>
        )}
      </div>
    </div>
  )
}
