'use client'

import { useState } from 'react'
import { Match, Team, Division } from '@/types'
import { 
  generateBracket, 
  updateBracketScore, 
  toggleBracketPublish,
  updateBracketMatch,
  updateBracketTeam 
} from '@/app/admin/events/[id]/bracket/actions'

interface BracketManagerProps {
  eventId: string
  initialMatches: Match[]
  divisions: Division[]
  allTeams: Team[]
}

export default function BracketManager({ eventId, initialMatches, divisions, allTeams }: BracketManagerProps) {
  const [divisionId, setDivisionId] = useState(divisions[0]?.id || '')
  const [loading, setLoading] = useState(false)
  const [scores, setScores] = useState<Record<string, { 
    s1_1: number, s1_2: number,
    s2_1: number, s2_2: number,
    s3_1: number, s3_2: number
  }>>({})

  const divisionMatches = (initialMatches || []).filter(m => m.division_id === divisionId)
  const divisionTeams = (allTeams || []).filter(t => t.division_id === divisionId)
  const currentDivision = divisions.find(d => d.id === divisionId)
  const isPublished = currentDivision?.bracket_published || false
  
  const rounds = Array.from(new Set(divisionMatches.map(m => m.bracket_round))).sort((a,b) => (a||0) - (b||0))

  const handleTogglePublish = async () => {
    setLoading(true)
    try {
      await toggleBracketPublish(eventId, divisionId, !isPublished)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      alert(message)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async (count: number) => {
    setLoading(true)
    try {
      await generateBracket(eventId, divisionId, count)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      alert(message)
    } finally {
      setLoading(false)
    }
  }

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
    const m = scores[matchId]
    const match = initialMatches.find(mm => mm.id === matchId)
    const data = m || {
      s1_1: match?.team_1_score || 0, 
      s1_2: match?.team_2_score || 0,
      s2_1: match?.team_1_score_2 || 0,
      s2_2: match?.team_2_score_2 || 0,
      s3_1: match?.team_1_score_3 || 0,
      s3_2: match?.team_2_score_3 || 0
    }

    setLoading(true)
    try {
      await updateBracketScore(
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
      setLoading(false)
    }
  }

  const handleCourtChange = async (matchId: string, court: string) => {
    try {
      await updateBracketMatch(eventId, matchId, { court })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      alert(message)
    }
  }

  const handleTeamChange = async (matchId: string, slot: 1 | 2, teamId: string) => {
    try {
      await updateBracketTeam(eventId, matchId, slot, teamId === 'null' ? null : teamId)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      alert(message)
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
          <div className={`flex items-center gap-4 px-6 py-3 rounded-[1.5rem] border-2 transition-all shadow-sm ${
            isPublished ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900'
          }`}>
             <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full animate-pulse ${isPublished ? 'bg-green-500' : 'bg-zinc-400'}`} />
                <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${isPublished ? 'text-green-600' : 'text-zinc-500'}`}>
                   Public Visibility: {isPublished ? 'LIVE' : 'HIDDEN'}
                </span>
             </div>
             <button 
               onClick={handleTogglePublish}
               disabled={loading}
               className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 isPublished 
                  ? 'bg-zinc-200 text-zinc-600 hover:bg-black hover:text-white' 
                  : 'bg-black text-white dark:bg-white dark:text-black hover:scale-105 active:scale-95'
               }`}
             >
                {isPublished ? 'Hide Bracket' : 'Publish Bracket'}
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
                 <div key={round} className="flex-1 min-w-[320px] space-y-6">
                    <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] border-b border-zinc-100 dark:border-zinc-900 pb-4">
                       {round === 1 ? 'Round 1' : round === 2 ? 'Semifinals' : 'Finals'}
                    </h3>
                    <div className="space-y-4">
                       {divisionMatches.filter(m => m.bracket_round === round).map(match => {
                          const currentScores = scores[match.id] || { 
                            s1_1: match.team_1_score, s1_2: match.team_2_score,
                            s2_1: match.team_1_score_2, s2_2: match.team_2_score_2,
                            s3_1: match.team_1_score_3, s3_2: match.team_2_score_3
                          }
                          const isFinal = match.status === 'final'

                          return (
                             <div key={match.id} className="p-4 md:p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] shadow-sm space-y-6">
                                <div className="flex items-center justify-between">
                                   <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Court</span>
                                      <input 
                                        type="text" 
                                        defaultValue={match.court || ''}
                                        onBlur={(e) => handleCourtChange(match.id, e.target.value)}
                                        className="w-10 px-2 py-1 bg-zinc-50 dark:bg-zinc-900 border-2 border-transparent focus:border-black dark:focus:border-white rounded-lg font-black text-center text-[10px] outline-none transition-all"
                                      />
                                   </div>
                                   <span className="text-[9px] font-black uppercase tracking-widest text-zinc-300">#{match.round_number}</span>
                                </div>

                                <div className="space-y-4">
                                   <div className="space-y-2">
                                      <select 
                                        value={match.team_1_id || 'null'}
                                        onChange={(e) => handleTeamChange(match.id, 1, e.target.value)}
                                        className={`w-full bg-transparent border-0 font-black uppercase tracking-tight text-[10px] outline-none cursor-pointer ${match.winner_team_id === match.team_1_id && isFinal ? 'text-black dark:text-white' : 'text-zinc-400'}`}
                                      >
                                         <option value="null">Select Team 1</option>
                                         {divisionTeams.map(t => <option key={t.id} value={t.id}>{t.team_name}</option>)}
                                      </select>
                                      <div className="flex gap-2 justify-end">
                                        {[1, 2, 3].map(s => (
                                          <input 
                                            key={`${match.id}-s${s}-t1`}
                                            type="number"
                                            value={(currentScores as any)[`s${s}_1`]}
                                            onChange={(e) => handleScoreChange(match.id, s as any, 1, e.target.value)}
                                            placeholder="-"
                                            className="w-8 md:w-10 h-8 md:h-10 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg text-center text-xs font-black outline-none focus:border-black dark:focus:border-white transition-all"
                                          />
                                        ))}
                                      </div>
                                   </div>

                                   <div className="pt-2 border-t border-zinc-50 dark:border-zinc-900 space-y-2">
                                      <select 
                                        value={match.team_2_id || 'null'}
                                        onChange={(e) => handleTeamChange(match.id, 2, e.target.value)}
                                        className={`w-full bg-transparent border-0 font-black uppercase tracking-tight text-[10px] outline-none cursor-pointer ${match.winner_team_id === match.team_2_id && isFinal ? 'text-black dark:text-white' : 'text-zinc-400'}`}
                                      >
                                         <option value="null">Select Team 2</option>
                                         {divisionTeams.map(t => <option key={t.id} value={t.id}>{t.team_name}</option>)}
                                      </select>
                                      <div className="flex gap-2 justify-end">
                                        {[1, 2, 3].map(s => (
                                          <input 
                                            key={`${match.id}-s${s}-t2`}
                                            type="number"
                                            value={(currentScores as any)[`s${s}_2`]}
                                            onChange={(e) => handleScoreChange(match.id, s as any, 2, e.target.value)}
                                            placeholder="-"
                                            className="w-8 md:w-10 h-8 md:h-10 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg text-center text-xs font-black outline-none focus:border-black dark:focus:border-white transition-all"
                                          />
                                        ))}
                                      </div>
                                   </div>
                                </div>
                                <button 
                                  onClick={() => handleSaveScore(match.id)}
                                  disabled={loading}
                                  className={`w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[9px] md:text-[10px] transition-all ${
                                    isFinal ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black' : 'bg-black text-white dark:bg-white dark:text-black shadow-lg shadow-zinc-200 dark:shadow-none active:scale-95'
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
