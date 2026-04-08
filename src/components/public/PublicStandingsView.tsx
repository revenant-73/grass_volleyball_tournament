'use client'

import { useState, useEffect } from 'react'
import { Division, Team, Match, Pool } from '@/types'
import { calculateStandings } from '@/lib/tournament-logic'
import { createClient } from '@/lib/supabase/client'

interface PublicStandingsViewProps {
  divisions: Division[]
  teams: Team[]
  matches: Match[]
  pools: Pool[]
}

export default function PublicStandingsView({
  divisions,
  teams,
  matches: initialMatches,
  pools,
}: PublicStandingsViewProps) {
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>(
    divisions[0]?.id || ''
  )
  const [matches, setMatches] = useState<Match[]>(initialMatches)

  useEffect(() => {
    if (!selectedDivisionId) return
    const supabase = createClient()
    
    // Subscribe to match updates only for this division
    const channel = supabase
      .channel(`public-matches-${selectedDivisionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
          filter: `division_id=eq.${selectedDivisionId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMatches(prev => [...prev, payload.new as Match])
          } else if (payload.eventType === 'UPDATE') {
            setMatches(prev => prev.map(m => m.id === (payload.new as Match).id ? (payload.new as Match) : m))
          } else if (payload.eventType === 'DELETE') {
            setMatches(prev => prev.filter(m => m.id !== (payload.old as { id: string }).id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedDivisionId])

  const divisionPools = pools.filter((p) => p.division_id === selectedDivisionId)
  const divisionTeams = teams.filter((t) => t.division_id === selectedDivisionId)
  const divisionMatches = matches.filter((m) => m.division_id === selectedDivisionId)

  return (
    <div className="space-y-8">
      {/* Division Selector */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {divisions.map((division) => (
          <button
            key={division.id}
            onClick={() => setSelectedDivisionId(division.id)}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              selectedDivisionId === division.id
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg'
                : 'bg-zinc-100 text-zinc-400 hover:text-black dark:bg-zinc-900 dark:hover:text-white'
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
            const standings = calculateStandings(poolTeams, poolMatches, pool.format_type)

            return (
              <div key={pool.id} className="bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                <div className="p-6 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900">
                  <h3 className="text-xl font-bold text-black dark:text-white uppercase tracking-tighter">
                    Pool {pool.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      Court {pool.court || 'TBD'}
                    </span>
                    <span className="px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      {poolTeams.length} Teams
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-zinc-100 dark:border-zinc-800">
                          <th className="text-left py-3 font-black text-[10px] uppercase tracking-widest text-zinc-400">Team</th>
                          <th className="text-center py-3 font-black text-[10px] uppercase tracking-widest text-zinc-400">M W-L</th>
                          <th className="text-center py-3 font-black text-[10px] uppercase tracking-widest text-zinc-400">S W-L</th>
                          <th className="text-center py-3 font-black text-[10px] uppercase tracking-widest text-zinc-400">Diff</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {standings.map((stat, idx) => (
                          <tr key={stat.team.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                            <td className="py-4 pr-4">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-zinc-300 w-4 font-black text-[10px] shrink-0">{idx + 1}</span>
                                <span className="font-bold text-black dark:text-white uppercase tracking-tight truncate">{stat.team.team_name}</span>
                              </div>
                            </td>
                            <td className="text-center py-4 font-black text-black dark:text-white tabular-nums">
                              {stat.wins}-{stat.losses}
                            </td>
                            <td className="text-center py-4 font-black text-zinc-500 tabular-nums">
                              {stat.setsWon}-{stat.setsLost}
                            </td>
                            <td className={`text-center py-4 font-black tabular-nums ${stat.pointDiff > 0 ? 'text-emerald-600' : stat.pointDiff < 0 ? 'text-rose-600' : 'text-zinc-400'}`}>
                              {stat.pointDiff > 0 ? `+${stat.pointDiff}` : stat.pointDiff}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="lg:col-span-2 py-24 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-[3rem] border-4 border-dashed border-zinc-100 dark:border-zinc-900">
            <p className="text-zinc-400 font-black uppercase tracking-widest text-sm">No pools created yet for this division.</p>
          </div>
        )}
      </div>
    </div>
  )
}
