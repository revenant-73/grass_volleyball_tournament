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
                  {bracketMatches.map(match => (
                     <MatchCard key={match.id} match={match} />
                  ))}
               </div>
            </section>
         )}

         <section className="space-y-6">
            <h2 className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.3em]">Pool Play</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {poolMatches.length > 0 ? poolMatches.map(match => (
                  <MatchCard key={match.id} match={match} />
               )) : (
                  <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs italic">No matches scheduled yet.</p>
               )}
            </div>
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
          
          <div className="flex flex-col items-center justify-center pl-6 border-l border-zinc-50 dark:border-zinc-900 min-w-[80px]">
             {isFinal ? (
                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Final</span>
             ) : isLive ? (
                <span className="text-[10px] font-black text-red-600 uppercase tracking-widest animate-pulse">Live</span>
             ) : (
                <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Upcoming</span>
             )}
             {match.pool && (
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mt-1">{match.pool.name}</p>
             )}
          </div>
       </div>
    </div>
  )
}
