'use client'

import { useState } from 'react'
import { Match, Team, Division } from '@/types'
import { generateBracket, updateBracketScore, toggleBracketPublish } from '@/app/admin/events/[id]/bracket/actions'

interface BracketManagerProps {
  eventId: string
  initialMatches: Match[]
  divisions: Division[]
}

export default function BracketManager({ eventId, initialMatches, divisions }: BracketManagerProps) {
  const [divisionId, setDivisionId] = useState(divisions[0]?.id || '')
  const [loading, setLoading] = useState(false)
  const [scores, setScores] = useState<Record<string, { t1: number, t2: number }>>({})

  const divisionMatches = initialMatches.filter(m => m.division_id === divisionId)
  const currentDivision = divisions.find(d => d.id === divisionId)
  const isPublished = currentDivision?.bracket_published || false
  
  const rounds = Array.from(new Set(divisionMatches.map(m => m.bracket_round))).sort((a,b) => (a||0) - (b||0))

  const handleTogglePublish = async () => {
    setLoading(true)
    try {
      await toggleBracketPublish(eventId, divisionId, !isPublished)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async (count: number) => {
    setLoading(true)
    try {
      await generateBracket(eventId, divisionId, count)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

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

    setLoading(true)
    try {
      await updateBracketScore(eventId, matchId, matchScores.t1, matchScores.t2)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 p-2 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800">
          {divisions.map(d => (
            <button
              key={d.id}
              onClick={() => setDivisionId(d.id)}
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

        {divisionMatches.length > 0 && (
          <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl border-2 transition-all ${
            isPublished ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900'
          }`}>
             <span className={`text-[10px] font-black uppercase tracking-widest ${isPublished ? 'text-green-600' : 'text-zinc-400'}`}>
                Bracket {isPublished ? 'Live' : 'Hidden'}
             </span>
             <button 
               onClick={handleTogglePublish}
               disabled={loading}
               className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                 isPublished ? 'bg-zinc-200 text-zinc-600' : 'bg-black text-white dark:bg-white dark:text-black'
               }`}
             >
                {isPublished ? 'Unpublish' : 'Publish to Public'}
             </button>
          </div>
        )}
      </div>

      {divisionMatches.length === 0 ? (
        <div className="p-24 text-center border-4 border-dashed border-zinc-100 dark:border-zinc-900 rounded-[3rem]">
           <p className="text-zinc-300 dark:text-zinc-700 font-black text-2xl uppercase tracking-tighter mb-8">
              No bracket generated yet
           </p>
           <div className="flex justify-center gap-4">
              <button 
                onClick={() => handleGenerate(4)}
                disabled={loading}
                className="px-8 py-4 bg-black text-white dark:bg-white dark:text-black font-black rounded-2xl uppercase tracking-widest text-xs hover:opacity-90 transition-opacity"
              >
                 Generate 4-Team Bracket
              </button>
              <button 
                onClick={() => handleGenerate(8)}
                disabled={loading}
                className="px-8 py-4 bg-black text-white dark:bg-white dark:text-black font-black rounded-2xl uppercase tracking-widest text-xs hover:opacity-90 transition-opacity"
              >
                 Generate 8-Team Bracket
              </button>
           </div>
           <p className="mt-6 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
              Based on current pool standings
           </p>
        </div>
      ) : (
        <div className="space-y-16">
           <div className="flex flex-col md:flex-row items-start gap-8 overflow-x-auto pb-8">
              {rounds.map(round => (
                 <div key={round} className="flex-1 min-w-[300px] space-y-6">
                    <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] border-b border-zinc-100 dark:border-zinc-900 pb-4">
                       {round === 1 ? 'Round 1' : round === 2 ? 'Semifinals' : 'Finals'}
                    </h3>
                    <div className="space-y-4">
                       {divisionMatches.filter(m => m.bracket_round === round).map(match => {
                          const currentScores = scores[match.id] || { t1: match.team_1_score, t2: match.team_2_score }
                          const isFinal = match.status === 'final'

                          return (
                             <div key={match.id} className="p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm space-y-4">
                                <div className="space-y-3">
                                   <div className="flex items-center justify-between gap-4">
                                      <p className={`font-black uppercase tracking-tight text-sm truncate ${match.winner_team_id === match.team_1_id && isFinal ? 'text-green-600' : 'text-zinc-400'}`}>
                                         {match.team_1?.team_name || 'TBD'}
                                      </p>
                                      <input 
                                        type="number"
                                        value={currentScores.t1}
                                        onChange={(e) => handleScoreChange(match.id, 't1', e.target.value)}
                                        className="w-12 h-12 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl text-center font-black outline-none"
                                      />
                                   </div>
                                   <div className="flex items-center justify-between gap-4">
                                      <p className={`font-black uppercase tracking-tight text-sm truncate ${match.winner_team_id === match.team_2_id && isFinal ? 'text-green-600' : 'text-zinc-400'}`}>
                                         {match.team_2?.team_name || 'TBD'}
                                      </p>
                                      <input 
                                        type="number"
                                        value={currentScores.t2}
                                        onChange={(e) => handleScoreChange(match.id, 't2', e.target.value)}
                                        className="w-12 h-12 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl text-center font-black outline-none"
                                      />
                                   </div>
                                </div>
                                <button 
                                  onClick={() => handleSaveScore(match.id)}
                                  className={`w-full py-3 rounded-xl font-black uppercase tracking-tighter text-[10px] transition-all ${
                                    isFinal ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400' : 'bg-black text-white dark:bg-white dark:text-black'
                                  }`}
                                >
                                   {isFinal ? 'Update Result' : 'Save Result'}
                                </button>
                             </div>
                          )
                       })}
                    </div>
                 </div>
              ))}
           </div>

           <div className="pt-12 border-t border-zinc-100 dark:border-zinc-900 flex justify-end">
              <button 
                onClick={() => { if(confirm('Reset bracket? This will delete all elimination results.')) handleGenerate(4) }}
                className="text-xs font-black uppercase tracking-widest text-red-600 hover:opacity-70"
              >
                 Reset Bracket
              </button>
           </div>
        </div>
      )}
    </div>
  )
}
