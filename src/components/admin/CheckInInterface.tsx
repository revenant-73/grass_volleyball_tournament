'use client'

import { useState } from 'react'
import { Team, Division } from '@/types'
import { toggleCheckIn } from '@/app/admin/events/[id]/registrations/actions'

interface CheckInInterfaceProps {
  eventId: string
  initialTeams: (Team & { check_ins: { id: string; team_id: string; event_id: string }[] })[]
  divisions: Division[]
}

export default function CheckInInterface({ eventId, initialTeams, divisions }: CheckInInterfaceProps) {
  const [search, setSearch] = useState('')
  const [divisionFilter, setDivisionFilter] = useState('all')

  const filteredTeams = initialTeams.filter(team => {
    const matchesSearch = 
      team.team_name.toLowerCase().includes(search.toLowerCase()) ||
      team.captain_name.toLowerCase().includes(search.toLowerCase())
    
    const matchesDivision = divisionFilter === 'all' || team.division_id === divisionFilter
    const isPaid = team.status === 'paid'

    return matchesSearch && matchesDivision && isPaid
  })

  const handleToggleCheckIn = async (teamId: string, isCheckedIn: boolean) => {
    try {
      await toggleCheckIn(eventId, teamId, !isCheckedIn)
    } catch (err) {
      console.error('Check-in error:', err)
      alert('Failed to update check-in status')
    }
  }

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-4 sticky top-4 z-10 shadow-lg">
        <div className="flex-1 min-w-[250px]">
          <input
            type="text"
            placeholder="Search team or captain name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl focus:border-black dark:focus:border-white transition-all outline-none text-base font-bold"
          />
        </div>
        <select
          value={divisionFilter}
          onChange={(e) => setDivisionFilter(e.target.value)}
          className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl focus:border-black dark:focus:border-white transition-all outline-none text-base font-bold"
        >
          <option value="all">All Divisions</option>
          {divisions.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeams.length > 0 ? filteredTeams.map((team) => {
          const isCheckedIn = team.check_ins?.length > 0

          return (
            <button
              key={team.id}
              onClick={() => handleToggleCheckIn(team.id, isCheckedIn)}
              className={`p-6 rounded-[2rem] border-2 text-left transition-all ${
                isCheckedIn
                  ? 'bg-green-500 border-green-400 text-white shadow-xl shadow-green-500/20'
                  : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                  isCheckedIn ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400'
                }`}>
                  {isCheckedIn ? 'Checked In' : 'Pending'}
                </span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${isCheckedIn ? 'opacity-60' : 'text-zinc-400'}`}>
                  {team.division?.name}
                </span>
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter mb-1 leading-tight">{team.team_name}</h3>
              <p className={`font-bold text-sm ${isCheckedIn ? 'opacity-80' : 'text-zinc-500'}`}>
                {team.captain_name} & {team.partner_name}
              </p>
            </button>
          )
        }) : (
          <div className="col-span-full p-24 text-center border-4 border-dashed border-zinc-100 dark:border-zinc-900 rounded-[3rem]">
             <p className="text-zinc-300 dark:text-zinc-700 font-black text-2xl uppercase tracking-tighter">
                No teams found
             </p>
          </div>
        )}
      </div>
    </div>
  )
}
