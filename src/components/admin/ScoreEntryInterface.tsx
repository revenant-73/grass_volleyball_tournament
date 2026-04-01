'use client'

import { useState } from 'react'
import { Match, Team, Division, Pool } from '@/types'
import { calculateStandings } from '@/lib/tournament-logic'
import { updateMatchScore } from '@/app/admin/events/[id]/pools/actions'

interface ScoreEntryInterfaceProps {
  eventId: string
  initialMatches: Match[]
  divisions: Division[]
  teams: Team[]
  pools: Pool[]
}

export default function ScoreEntryInterface({ eventId, initialMatches, divisions, teams, pools }: ScoreEntryInterfaceProps) {
  const [divisionId, setDivisionId] = useState(divisions[0]?.id || '')
  const [activePoolId, setActivePoolId] = useState('')
  const [scores, setScores] = useState<Record<string, { t1: number, t2: number }>>({})
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const divisionPools = pools.filter(p => p.division_id === divisionId)
  
  // Set default pool if not set
  if (divisionPools.length > 0 && !activePoolId) {
    setActivePoolId(divisionPools[0].id)
  } else if (divisionPools.length > 0 && !divisionPools.find(p => p.id === activePoolId)) {
    setActivePoolId(divisionPools[0].id)
  }

  const poolMatches = initialMatches.filter(m => m.pool_id === activePoolId)
  const poolTeams = teams.filter(t => t.division_id === divisionId && initialMatches.some(m => m.pool_id === activePoolId && (m.team_1_id === t.id || m.team_2_id === t.id)))
  const standings = calculateStandings(poolTeams, poolMatches)

  const handleScoreChange = (matchId: string, team: 't1' | 't2', val: string) => {
    const num = parseInt(val) || 0
    setScores(prev => ({
      ...prev,
      [matchId]: {
        ...(prev[matchId] || { t1: initialMatches.find(m => m.id === matchId)?.team_1_score || 0, t2: initialMatches.find(m => m.id === matchId)?.team_2_score || 0 }),
        [team]: num
      }
    }))
  }

  const handleSaveScore = async (matchId: string) => {
    const matchScores = scores[matchId]
    if (!matchScores) return

    setLoadingId(matchId)
    try {
      await updateMatchScore(eventId, matchId, matchScores.t1, matchScores.t2)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="space-y-12 pb-24">
      {/* Division/Pool Selectors */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4 bg-zinc-50 dark:bg-zinc-900 p-2 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800">
          {divisions.map(d => (
            <button
              key={d.id}
              onClick={() => {
                setDivisionId(d.id)
                setActivePoolId('') // Reset pool
              }}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                divisionId === d.id 
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' 
                  : 'text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>

        {divisionPools.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {divisionPools.map(p => (
              <button
                key={p.id}
                onClick={() => setActivePoolId(p.id)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  activePoolId === p.id 
                    ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white' 
                    : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Standings */}
        <div className="lg:col-span-1">
           <h2 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em] mb-6">Current Standings</h2>
           <div className="bg-white dark:bg-zinc-950 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                 <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                       <th className="px-4 py-3 font-black text-[10px] uppercase tracking-widest">Team</th>
                       <th className="px-4 py-3 font-black text-[10px] uppercase tracking-widest text-center">W-L</th>
                       <th className="px-4 py-3 font-black text-[10px] uppercase tracking-widest text-center">+/-</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
                    {standings.map((s, i) => (
                       <tr key={s.team.id} className={i < 2 ? 'bg-green-50/30 dark:bg-green-900/10' : ''}>
                          <td className="px-4 py-4">
                             <p className="font-bold text-black dark:text-white uppercase tracking-tight truncate max-w-[120px]">
                                {s.team.team_name}
                             </p>
                          </td>
                          <td className="px-4 py-4 text-center font-black">
                             {s.wins}-{s.losses}
                          </td>
                          <td className={`px-4 py-4 text-center font-bold ${s.pointDiff > 0 ? 'text-green-600' : s.pointDiff < 0 ? 'text-red-600' : ''}`}>
                             {s.pointDiff > 0 ? `+${s.pointDiff}` : s.pointDiff}
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           <p className="mt-4 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
              Tiebreakers: Wins &gt; Point Diff &gt; Points For
           </p>
        </div>

        {/* Matches */}
        <div className="lg:col-span-2 space-y-6">
           <h2 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em] mb-6">Match Results</h2>
           <div className="grid grid-cols-1 gap-4">
              {poolMatches.length > 0 ? poolMatches.map((match) => {
                 const currentScores = scores[match.id] || { t1: match.team_1_score, t2: match.team_2_score }
                 const isFinal = match.status === 'final'
                 const isSaving = loadingId === match.id

                 return (
                    <div key={match.id} className={`p-6 bg-white dark:bg-zinc-950 border ${isFinal ? 'border-zinc-100 dark:border-zinc-900' : 'border-zinc-200 dark:border-zinc-800'} rounded-3xl group hover:shadow-md transition-all`}>
                       <div className="flex flex-col md:flex-row items-center gap-8">
                          <div className="flex-1 w-full flex items-center justify-between gap-4">
                             <div className="flex-1 text-right">
                                <p className="font-black text-black dark:text-white uppercase tracking-tight line-clamp-1">{match.team_1?.team_name}</p>
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{match.team_1?.captain_name}</p>
                             </div>
                             
                             <div className="flex items-center gap-2">
                                <input 
                                  type="number"
                                  value={currentScores.t1}
                                  onChange={(e) => handleScoreChange(match.id, 't1', e.target.value)}
                                  className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl text-center text-2xl font-black focus:border-black dark:focus:border-white transition-all outline-none"
                                />
                                <span className="font-black text-zinc-300">vs</span>
                                <input 
                                  type="number"
                                  value={currentScores.t2}
                                  onChange={(e) => handleScoreChange(match.id, 't2', e.target.value)}
                                  className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl text-center text-2xl font-black focus:border-black dark:focus:border-white transition-all outline-none"
                                />
                             </div>

                             <div className="flex-1 text-left">
                                <p className="font-black text-black dark:text-white uppercase tracking-tight line-clamp-1">{match.team_2?.team_name}</p>
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{match.team_2?.captain_name}</p>
                             </div>
                          </div>

                          <div className="flex flex-col gap-2 min-w-[120px]">
                             <button 
                               onClick={() => handleSaveScore(match.id)}
                               disabled={isSaving}
                               className={`px-4 py-3 rounded-xl font-black uppercase tracking-tighter text-xs transition-all ${
                                 isFinal 
                                   ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black' 
                                   : 'bg-black text-white dark:bg-white dark:text-black shadow-lg hover:scale-105'
                               }`}
                             >
                                {isSaving ? '...' : isFinal ? 'Edit Result' : 'Save Result'}
                             </button>
                             {isFinal && (
                                <p className="text-[10px] font-black text-center text-green-600 uppercase tracking-widest animate-pulse">
                                   Final
                                </p>
                             )}
                          </div>
                       </div>
                    </div>
                 )
              }) : (
                 <div className="p-12 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-900 rounded-[2rem]">
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs italic">
                       No matches generated for this pool yet
                    </p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  )
}
