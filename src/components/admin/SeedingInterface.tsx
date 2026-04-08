'use client'

import { useState, useEffect } from 'react'
import { Team, Division } from '@/types'
import { saveSeeding } from '@/app/admin/events/[id]/registrations/actions'

interface SeedingInterfaceProps {
  eventId: string
  eventSlug: string
  initialTeams: Team[]
  divisions: Division[]
}

export default function SeedingInterface({ eventId, eventSlug, initialTeams, divisions }: SeedingInterfaceProps) {
  const [divisionId, setDivisionId] = useState(divisions[0]?.id || '')
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    // Filter teams for the selected division
    const divTeams = initialTeams.filter(t => t.division_id === divisionId)
    // Ensure they are ordered by seed if it exists, otherwise use their current array order
    setTeams(divTeams)
    setHasChanges(false)
  }, [divisionId, initialTeams])

  const moveTeam = (index: number, direction: 'up' | 'down') => {
    const newTeams = [...teams]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= newTeams.length) return

    const [movedTeam] = newTeams.splice(index, 1)
    newTeams.splice(targetIndex, 0, movedTeam)
    
    setTeams(newTeams)
    setHasChanges(true)
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null)

    const teamSeeds = teams.map((team, index) => ({
      teamId: team.id,
      seed: index + 1
    }))

    try {
      await saveSeeding(eventId, divisionId, teamSeeds, eventSlug)
      setHasChanges(false)
      alert('Seeding saved successfully')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 pb-24">
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

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-900/30 font-bold">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {teams.length > 0 ? (
          teams.map((team, index) => (
            <div 
              key={team.id} 
              className="p-5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-between group hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center font-black text-lg tracking-tighter">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-black text-black dark:text-white uppercase tracking-tight">{team.team_name}</h4>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                    Captain: {team.captain_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => moveTeam(index, 'up')}
                  disabled={index === 0}
                  className="p-2 bg-zinc-50 dark:bg-zinc-900 text-zinc-400 hover:text-black dark:hover:text-white disabled:opacity-0 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => moveTeam(index, 'down')}
                  disabled={index === teams.length - 1}
                  className="p-2 bg-zinc-50 dark:bg-zinc-900 text-zinc-400 hover:text-black dark:hover:text-white disabled:opacity-0 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-900 rounded-[2rem]">
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs italic">
               No paid teams in this division yet
            </p>
          </div>
        )}
      </div>

      {hasChanges && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 duration-500">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-12 py-5 bg-black text-white dark:bg-white dark:text-black font-black rounded-3xl shadow-2xl hover:scale-105 transition-all uppercase tracking-widest flex items-center gap-3"
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            Save Seeding Changes
          </button>
        </div>
      )}
    </div>
  )
}
