'use client'

import { useState, useEffect } from 'react'
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
  const [scores, setScores] = useState<Record<string, { 
    s1_1: number, s1_2: number, 
    s2_1: number, s2_2: number, 
    s3_1: number, s3_2: number
  }>>({})
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const divisionPools = pools.filter(p => p.division_id === divisionId)

  // Set default pool if not set
  useEffect(() => {
    if (divisionPools.length > 0 && !activePoolId) {
      setActivePoolId(divisionPools[0].id)
    } else if (divisionPools.length > 0 && !divisionPools.find(p => p.id === activePoolId)) {
      setActivePoolId(divisionPools[0].id)
    }
  }, [divisionId, divisionPools, activePoolId])

  // Sync scores state when initialMatches updates (props from server)
  useEffect(() => {
    setScores(prev => {
      const newScores = { ...prev }
      let changed = false
      Object.keys(newScores).forEach(matchId => {
        const match = initialMatches.find(m => m.id === matchId)
        if (match) {
          const s = newScores[matchId]
          // If the server data now matches our local state, we can clear the local state
          if (
            s.s1_1 === (match.team_1_score ?? 0) &&
            s.s1_2 === (match.team_2_score ?? 0) &&
            s.s2_1 === (match.team_1_score_2 ?? 0) &&
            s.s2_2 === (match.team_2_score_2 ?? 0) &&
            s.s3_1 === (match.team_1_score_3 ?? 0) &&
            s.s3_2 === (match.team_2_score_3 ?? 0)
          ) {
            delete newScores[matchId]
            changed = true
          }
        }
      })
      return changed ? newScores : prev
    })
  }, [initialMatches])

  const poolMatches = initialMatches.filter(m => m.pool_id === activePoolId)
  const poolTeams = teams.filter(t => t.division_id === divisionId && initialMatches.some(m => m.pool_id === activePoolId && (m.team_1_id === t.id || m.team_2_id === t.id)))
  const standings = calculateStandings(poolTeams, poolMatches)

  const handleScoreChange = (matchId: string, set: 1 | 2 | 3, team: 1 | 2, val: string) => {
    const num = parseInt(val) || 0
    const match = initialMatches.find(m => m.id === matchId)
    setScores(prev => ({
      ...prev,
      [matchId]: {
        ...(prev[matchId] || { 
          s1_1: match?.team_1_score || 0, 
          s1_2: match?.team_2_score || 0,
          s2_1: match?.team_1_score_2 || 0,
          s2_2: match?.team_2_score_2 || 0,
          s3_1: match?.team_1_score_3 || 0,
          s3_2: match?.team_2_score_3 || 0
        }),
        [`s${set}_${team}`]: num
      }
    }))
  }

  const handleSaveScore = async (matchId: string) => {
    const match = initialMatches.find(mm => mm.id === matchId)
    if (!match) return

    const m = scores[matchId]
    const data = {
      s1_1: m ? m.s1_1 : (match.team_1_score || 0), 
      s1_2: m ? m.s1_2 : (match.team_2_score || 0),
      s2_1: m ? m.s2_1 : (match.team_1_score_2 || 0),
      s2_2: m ? m.s2_2 : (match.team_2_score_2 || 0),
      s3_1: m ? m.s3_1 : (match.team_1_score_3 || 0),
      s3_2: m ? m.s3_2 : (match.team_2_score_3 || 0)
    }

    setLoadingId(matchId)
    try {
      await updateMatchScore(
        eventId, 
        matchId, 
        data.s1_1, data.s1_2,
        data.s2_1, data.s2_2,
        data.s3_1, data.s3_2
      )
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      alert(message)
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
                 const currentData = scores[match.id] || { 
                   s1_1: match.team_1_score, s1_2: match.team_2_score, 
                   s2_1: match.team_1_score_2, s2_2: match.team_2_score_2,
                   s3_1: match.team_1_score_3, s3_2: match.team_2_score_3,
                   court: match.court || '' 
                 }
                 const isFinal = match.status === 'final'
                 const isSaving = loadingId === match.id

                 return (
                    <div key={match.id} className={`p-4 md:p-6 bg-white dark:bg-zinc-950 border ${isFinal ? 'border-zinc-100 dark:border-zinc-900' : 'border-zinc-200 dark:border-zinc-800'} rounded-3xl group hover:shadow-md transition-all overflow-hidden`}>
                       <div className="flex flex-col gap-6">
                          {/* Teams Header */}
                          <div className="flex items-center justify-between gap-2">
                             <div className="flex-1 text-right min-w-0">
                                <p className="font-black text-black dark:text-white uppercase tracking-tight truncate text-sm md:text-base">{match.team_1?.team_name}</p>
                                <p className="text-[8px] md:text-[10px] text-zinc-400 font-bold uppercase tracking-widest truncate">{match.team_1?.captain_name}</p>
                             </div>
                             
                             <div className="px-3 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-full">
                                <span className="font-black text-[10px] text-zinc-400 uppercase tracking-widest">VS</span>
                             </div>

                             <div className="flex-1 text-left min-w-0">
                                <p className="font-black text-black dark:text-white uppercase tracking-tight truncate text-sm md:text-base">{match.team_2?.team_name}</p>
                                <p className="text-[8px] md:text-[10px] text-zinc-400 font-bold uppercase tracking-widest truncate">{match.team_2?.captain_name}</p>
                             </div>
                          </div>

                          {/* Scores Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             {[1, 2, 3].map((setNum) => (
                               <div key={setNum} className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                 <div className="flex items-center justify-between mb-2">
                                   <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Set {setNum}</span>
                                   {setNum === 3 && <span className="text-[8px] font-black text-zinc-400/50 uppercase italic">To 15</span>}
                                 </div>
                                 <div className="flex items-center gap-3">
                                   <input 
                                     key={`${match.id}-s${setNum}-t1`}
                                     type="number"
                                     value={(currentData as Record<string, number>)[`s${setNum}_1`]}
                                     onChange={(e) => handleScoreChange(match.id, setNum as 1 | 2 | 3, 1, e.target.value)}
                                     className="w-full h-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-center text-xl font-black focus:border-black dark:focus:border-white transition-all outline-none"
                                   />
                                   <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800" />
                                   <input 
                                     key={`${match.id}-s${setNum}-t2`}
                                     type="number"
                                     value={(currentData as Record<string, number>)[`s${setNum}_2`]}
                                     onChange={(e) => handleScoreChange(match.id, setNum as 1 | 2 | 3, 2, e.target.value)}
                                     className="w-full h-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-center text-xl font-black focus:border-black dark:focus:border-white transition-all outline-none"
                                   />
                                 </div>
                               </div>
                             ))}
                          </div>

                          {/* Footer Info & Actions */}
                          <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 pt-4 border-t border-zinc-50 dark:border-zinc-900">
                             <div className="w-full sm:w-auto flex-1">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                   Court {match.court || match.pool?.court || 'TBD'}
                                </p>
                             </div>
                             
                             <div className="flex items-center gap-3 w-full sm:w-auto">
                               {isFinal && (
                                 <div className="hidden sm:flex items-center gap-2 mr-2">
                                   <span className="w-2 h-2 bg-green-500 rounded-full" />
                                   <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Final</span>
                                 </div>
                               )}
                               <button 
                                 onClick={() => handleSaveScore(match.id)}
                                 disabled={isSaving}
                                 className={`flex-1 sm:flex-none px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${
                                   isFinal 
                                     ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black' 
                                     : 'bg-black text-white dark:bg-white dark:text-black shadow-lg shadow-zinc-200 dark:shadow-none hover:scale-105 active:scale-95'
                                 }`}
                               >
                                  {isSaving ? '...' : isFinal ? 'Update' : 'Save Result'}
                               </button>
                             </div>
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
