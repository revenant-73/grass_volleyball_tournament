'use client'

import { useState, useEffect } from 'react'
import { Team, Division, Pool, Match } from '@/types'
import { createPools, clearPools, generatePoolMatches, clearPoolMatches } from '@/app/admin/events/[id]/pools/actions'
import { createClient } from '@/lib/supabase/client'
import { getRecommendedFormat, getPoolSizes } from '@/lib/tournament-formats'

interface PoolBuilderProps {
  eventId: string
  initialTeams: Team[]
  divisions: Division[]
  existingPools: (Pool & { assignments: { team_id: string; seed: number; team?: Team }[] })[]
}

export default function PoolBuilder({ eventId, initialTeams, divisions, existingPools }: PoolBuilderProps) {
  const [divisionId, setDivisionId] = useState(divisions[0]?.id || '')
  const [numPools, setNumPools] = useState(2)
  const [loading, setLoading] = useState(false)
  const [previewPools, setPreviewPools] = useState<{ name: string, teamIds: string[], teams: Team[], court: string }[]>([])
  const [matchCount, setMatchCount] = useState(0)

  useEffect(() => {
    async function fetchMatchCount() {
      const supabase = createClient()
      const { count } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .eq('division_id', divisionId)
        .eq('stage_type', 'pool')
      setMatchCount(count || 0)
    }
    fetchMatchCount()
  }, [divisionId])

  const currentDivisionPools = existingPools.filter(p => p.division_id === divisionId)
  const divisionTeams = initialTeams.filter(t => t.division_id === divisionId)
  
  const recommendedFormat = getRecommendedFormat(divisionTeams.length)

  const generateSnakePools = () => {
    const pools: { name: string, teamIds: string[], teams: Team[], court: string }[] = []
    for (let i = 0; i < numPools; i++) {
      pools.push({ name: `Pool ${String.fromCharCode(65 + i)}`, teamIds: [], teams: [], court: (i + 1).toString() })
    }

    // Sort by manual_seed
    const sortedTeams = [...divisionTeams].sort((a, b) => {
       const seedA = a.manual_seed || 999
       const seedB = b.manual_seed || 999
       return seedA - seedB
    })

    sortedTeams.forEach((team, index) => {
      const poolIndex = Math.floor(index / numPools)
      const isReversed = poolIndex % 2 !== 0
      
      let targetPool
      if (!isReversed) {
        targetPool = index % numPools
      } else {
        targetPool = (numPools - 1) - (index % numPools)
      }
      
      pools[targetPool].teamIds.push(team.id)
      pools[targetPool].teams.push(team)
    })

    setPreviewPools(pools)
  }

  const applyRecommendedSetup = () => {
    if (!recommendedFormat) return
    
    const sizes = getPoolSizes(divisionTeams.length)
    if (sizes.length === 0) return

    const pools: { name: string, teamIds: string[], teams: Team[], court: string }[] = []
    sizes.forEach((_, i) => {
      pools.push({ name: `Pool ${String.fromCharCode(65 + i)}`, teamIds: [], teams: [], court: (i + 1).toString() })
    })

    // Sort by manual_seed
    const sortedTeams = [...divisionTeams].sort((a, b) => {
       const seedA = a.manual_seed || 999
       const seedB = b.manual_seed || 999
       return seedA - seedB
    })

    // Distribute teams based on sizes (snake draft style)
    let teamIndex = 0
    let reverse = false
    const maxTeamsInAnyPool = Math.max(...sizes)

    // For mixed pool sizes, we iterate round by round
    for (let round = 0; round < maxTeamsInAnyPool; round++) {
      const poolOrder = reverse 
        ? [...Array(sizes.length).keys()].reverse()
        : [...Array(sizes.length).keys()]
      
      for (const pIdx of poolOrder) {
        if (pools[pIdx].teams.length < sizes[pIdx] && teamIndex < sortedTeams.length) {
          const team = sortedTeams[teamIndex++]
          pools[pIdx].teamIds.push(team.id)
          pools[pIdx].teams.push(team)
        }
      }
      reverse = !reverse
    }

    setPreviewPools(pools)
  }

  const handleSave = async () => {
    if (!confirm('This will replace any existing pools for this division. Continue?')) return
    setLoading(true)
    try {
      await createPools(eventId, divisionId, previewPools.map(p => ({ name: p.name, teamIds: p.teamIds, court: p.court })))
      alert('Pools saved successfully')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      alert(message)
    } finally {
      setLoading(false)
    }
  }

  const updatePreviewCourt = (index: number, court: string) => {
    const newPools = [...previewPools]
    newPools[index] = { ...newPools[index], court }
    setPreviewPools(newPools)
  }

  const handleClear = async () => {
    if (!confirm('Are you sure you want to delete all pools for this division?')) return
    setLoading(true)
    try {
      await clearPools(eventId, divisionId)
      alert('Pools cleared')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      alert(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-12 pb-24">
       {/* Recommendation Section */}
       {divisionTeams.length > 0 && (
         <div className={`p-8 rounded-[2.5rem] border-2 transition-all ${
           divisionTeams.length === 7 
             ? 'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/20' 
             : 'bg-zinc-900 border-zinc-800 text-white'
         }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
               <div>
                  <div className="flex items-center gap-3 mb-2">
                     <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                       divisionTeams.length === 7 ? 'bg-red-600 text-white' : 'bg-white/20 text-white'
                     }`}>
                        {divisionTeams.length} Teams Checked In
                     </span>
                     {recommendedFormat && (
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                           {recommendedFormat.waves} Waves • {recommendedFormat.courts} Courts
                        </span>
                     )}
                  </div>
                  <h2 className={`text-2xl font-black uppercase tracking-tighter leading-tight ${divisionTeams.length === 7 ? 'text-red-600 dark:text-red-500' : ''}`}>
                     {divisionTeams.length === 7 
                       ? "7 Teams: No Clean Format" 
                       : recommendedFormat?.description || "Custom Format Required"}
                  </h2>
                  <p className={`mt-2 font-bold text-sm ${divisionTeams.length === 7 ? 'text-red-400' : 'text-zinc-400'}`}>
                     {divisionTeams.length === 7 
                       ? "Rules prevent lone 3-team pools and require 5-team pools to use 2 courts. Please manually adjust."
                       : recommendedFormat?.layout || "Manual distribution required for this team count."}
                  </p>
               </div>
               {recommendedFormat && divisionTeams.length !== 7 && (
                  <button 
                    onClick={applyRecommendedSetup}
                    className="px-8 py-4 bg-white text-black font-black rounded-2xl uppercase tracking-tighter hover:bg-zinc-200 transition-colors shadow-xl"
                  >
                     Use Recommended Setup
                  </button>
               )}
            </div>
         </div>
       )}

       <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 p-2 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800">
            {divisions.map(d => (
              <button
                key={d.id}
                onClick={() => {
                  setDivisionId(d.id)
                  setPreviewPools([])
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

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Number of Pools</label>
                <select 
                  value={numPools}
                  onChange={(e) => setNumPools(parseInt(e.target.value))}
                  className="px-4 py-2 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl font-bold"
                >
                   {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
             </div>
             <button 
               onClick={generateSnakePools}
               className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-black rounded-xl text-xs uppercase tracking-tighter hover:opacity-90 transition-opacity"
             >
                Generate Preview
             </button>
          </div>
       </div>

       {currentDivisionPools.length > 0 && previewPools.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {currentDivisionPools.map(pool => (
                <div key={pool.id} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8">
                   <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-50 dark:border-zinc-900">
                      <h3 className="text-xl font-black uppercase tracking-tighter">{pool.name}</h3>
                      <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-500">
                         Court {pool.court || 'TBD'}
                      </span>
                   </div>
                   <div className="space-y-4">
                      {pool.assignments?.sort((a,b) => a.seed - b.seed).map((asgn, i) => (
                         <div key={asgn.id} className="flex items-center gap-4">
                            <span className="w-6 h-6 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center text-[10px] font-black text-zinc-400">
                               {asgn.seed}
                            </span>
                            <p className="font-bold text-sm uppercase tracking-tight">{asgn.team?.team_name}</p>
                         </div>
                      ))}
                   </div>
                </div>
             ))}
          </div>
       )}

       {previewPools.length > 0 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em]">Pool Preview (Snake Draft)</h2>
                <div className="flex gap-4">
                   <button 
                     onClick={() => setPreviewPools([])}
                     className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-black"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={handleSave}
                     disabled={loading}
                     className="px-8 py-3 bg-green-600 text-white font-black rounded-xl text-xs uppercase tracking-tighter hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                   >
                     {loading ? 'Saving...' : 'Save All Assignments'}
                   </button>
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {previewPools.map((pool, pi) => (
                   <div key={pi} className="bg-zinc-900 text-white rounded-[2rem] p-8 shadow-2xl">
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                         <h3 className="text-xl font-black uppercase tracking-tighter">{pool.name}</h3>
                         <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Court</span>
                            <input 
                              type="text" 
                              value={pool.court}
                              onChange={(e) => updatePreviewCourt(pi, e.target.value)}
                              className="w-12 px-2 py-1 bg-white/10 border border-white/10 rounded font-black text-center text-xs outline-none focus:border-white/40 transition-all"
                            />
                         </div>
                      </div>
                      <div className="space-y-4">
                         {pool.teams.map((team, ti) => (
                            <div key={team.id} className="flex items-center gap-4">
                               <span className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-[10px] font-black text-zinc-400">
                                  {ti + 1}
                               </span>
                               <div>
                                  <p className="font-bold text-sm uppercase tracking-tight">{team.team_name}</p>
                                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Seed {team.manual_seed || 'N/A'}</p>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                ))}
             </div>
          </div>
       )}

       {currentDivisionPools.length > 0 && previewPools.length === 0 && (
          <div className="pt-12 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8">
             <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 flex-1 w-full md:w-auto">
                <div className="flex items-center justify-between mb-4">
                   <h4 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Pool Play Matches</h4>
                   <span className="px-2 py-0.5 bg-black text-white dark:bg-white dark:text-black text-[10px] font-black rounded uppercase tracking-widest">
                      {matchCount} Generated
                   </span>
                </div>
                {matchCount === 0 ? (
                   <button 
                     onClick={async () => {
                       setLoading(true)
                       try {
                         await generatePoolMatches(eventId, divisionId)
                         window.location.reload()
                       } catch(e: any) { alert(e.message) }
                       finally { setLoading(false) }
                     }}
                     className="w-full py-4 bg-black text-white dark:bg-white dark:text-black font-black rounded-xl uppercase tracking-widest text-xs hover:opacity-90 transition-opacity"
                   >
                      Generate All Round-Robin Matches
                   </button>
                ) : (
                   <button 
                     onClick={async () => {
                        if(!confirm('Clear all matches?')) return
                        setLoading(true)
                        try {
                          await clearPoolMatches(eventId, divisionId)
                          window.location.reload()
                        } catch(e: any) { alert(e.message) }
                        finally { setLoading(false) }
                      }}
                     className="w-full py-4 bg-red-50 text-red-600 font-black rounded-xl uppercase tracking-widest text-xs hover:bg-red-100 transition-colors"
                   >
                      Clear Pool Matches
                   </button>
                )}
             </div>

             <button 
               onClick={handleClear}
               disabled={loading}
               className="px-6 py-3 bg-zinc-100 text-zinc-400 font-black rounded-xl text-xs uppercase tracking-tighter hover:bg-red-50 hover:text-red-600 transition-all"
             >
               Clear All Pools & Assignments
             </button>
          </div>
       )}

       {currentDivisionPools.length === 0 && previewPools.length === 0 && (
          <div className="p-24 text-center border-4 border-dashed border-zinc-100 dark:border-zinc-900 rounded-[3rem]">
             <p className="text-zinc-300 dark:text-zinc-700 font-black text-2xl uppercase tracking-tighter">
                No pools created yet
             </p>
             <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs mt-2">
                Use the generator above to distribute teams
             </p>
          </div>
       )}
    </div>
  )
}
