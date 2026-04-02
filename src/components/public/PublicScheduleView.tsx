'use client'

import { useState } from 'react'
import { Match, Division } from '@/types'

interface PublicScheduleViewProps {
  divisions: Division[]
  initialMatches: Match[]
}

export default function PublicScheduleView({ divisions, initialMatches }: PublicScheduleViewProps) {
  const [activeDivisionId, setActiveDivisionId] = useState(divisions[0]?.id || '')

  const filteredMatches = initialMatches.filter(m => m.division_id === activeDivisionId)
  
  // Group by stage and pool/round
  const poolMatches = filteredMatches.filter(m => m.stage_type === 'pool')
  const bracketMatches = filteredMatches.filter(m => m.stage_type === 'bracket')

  // Group pool matches by pool name
  const matchesByPool: Record<string, Match[]> = {}
  poolMatches.forEach(match => {
    const poolName = match.pool?.name || 'Unknown Pool'
    if (!matchesByPool[poolName]) {
      matchesByPool[poolName] = []
    }
    matchesByPool[poolName].push(match)
  })

  // Sort pools alphabetically and matches by creation/time
  const sortedPoolNames = Object.keys(matchesByPool).sort()
  sortedPoolNames.forEach(name => {
    matchesByPool[name].sort((a, b) => {
      const timeA = a.scheduled_time || a.created_at || ''
      const timeB = b.scheduled_time || b.created_at || ''
      return timeA.localeCompare(timeB)
    })
  })

  return (
    <div className="space-y-12 pb-24">
      {/* Division Selector */}
      <div className="flex flex-wrap items-center gap-4 bg-zinc-100 dark:bg-zinc-900 p-2 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800">
        {divisions.map(d => (
          <button
            key={d.id}
            onClick={() => setActiveDivisionId(d.id)}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeDivisionId === d.id 
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' 
                : 'text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-12">
         {bracketMatches.length > 0 && (
            <section className="space-y-6">
               <h2 className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.3em]">Elimination Bracket</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bracketMatches.sort((a, b) => {
                    if (a.bracket_round !== b.bracket_round) return (a.bracket_round || 0) - (b.bracket_round || 0)
                    return (a.round_number || 0) - (b.round_number || 0)
                  }).map(match => (
                     <MatchCard key={match.id} match={match} />
                  ))}
               </div>
            </section>
         )}

         <section className="space-y-8">
            <h2 className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.3em]">Pool Play</h2>
            
            {sortedPoolNames.length > 0 ? (
              <div className="space-y-12">
                {sortedPoolNames.map(poolName => (
                  <div key={poolName} className="space-y-4">
                    <h3 className="text-lg font-black text-black dark:text-white uppercase tracking-tighter flex items-center gap-3">
                      <span className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center text-xs">
                        {poolName.replace('Pool ', '')}
                      </span>
                      {poolName}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {matchesByPool[poolName].map(match => (
                        <MatchCard key={match.id} match={match} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
               <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs italic">No matches scheduled yet.</p>
            )}
         </section>
      </div>
    </div>
  )
}

function MatchCard({ match }: { match: Match }) {
  const isFinal = match.status === 'final'
  const isLive = match.status === 'live'

  return (
    <div className={`p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl group hover:border-black dark:hover:border-white transition-all shadow-sm`}>
       <div className="flex items-center justify-between gap-4">
          <div className="flex-1 space-y-3">
             <div className="flex items-center justify-between">
                <p className={`font-black uppercase tracking-tight text-sm truncate ${isFinal && match.winner_team_id === match.team_1_id ? 'text-black dark:text-white' : 'text-zinc-400'}`}>
                   {match.team_1?.team_name || 'TBD'}
                </p>
                {isFinal && <p className="font-black text-lg">{match.team_1_score}</p>}
             </div>
             <div className="flex items-center justify-between">
                <p className={`font-black uppercase tracking-tight text-sm truncate ${isFinal && match.winner_team_id === match.team_2_id ? 'text-black dark:text-white' : 'text-zinc-400'}`}>
                   {match.team_2?.team_name || 'TBD'}
                </p>
                {isFinal && <p className="font-black text-lg">{match.team_2_score}</p>}
             </div>
          </div>
          
          <div className="flex flex-col items-center justify-center pl-6 border-l border-zinc-100 dark:border-zinc-900 min-w-[100px]">
             <div className="flex flex-col items-center gap-1">
                {isFinal ? (
                   <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Final</span>
                ) : isLive ? (
                   <span className="text-[10px] font-black text-red-600 uppercase tracking-widest animate-pulse">Live</span>
                ) : (
                   <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Upcoming</span>
                )}
                
                {match.court && (
                  <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                    Court {match.court}
                  </span>
                )}
             </div>
             
             {match.stage_type === 'bracket' && match.pool && (
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mt-2">{match.pool.name}</p>
             )}
          </div>
       </div>
    </div>
  )
}
