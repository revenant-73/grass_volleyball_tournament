'use client'

import { useState } from 'react'
import { Team, Division, TeamStatus } from '@/types'
import { updateTeamStatus, withdrawTeam, refundTeam } from '@/app/admin/events/[id]/registrations/actions'
import TeamEditForm from './TeamEditForm'

interface TeamManagementProps {
  eventId: string
  eventSlug: string
  initialTeams: Team[]
  divisions: Division[]
}

export default function TeamManagement({ eventId, eventSlug, initialTeams, divisions }: TeamManagementProps) {
  const [search, setSearch] = useState('')
  const [divisionFilter, setDivisionFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [isRefunding, setIsRefunding] = useState<string | null>(null)

  const filteredTeams = initialTeams.filter(team => {
    const matchesSearch = 
      team.team_name.toLowerCase().includes(search.toLowerCase()) ||
      team.captain_name.toLowerCase().includes(search.toLowerCase()) ||
      team.captain_email.toLowerCase().includes(search.toLowerCase())
    
    const matchesDivision = divisionFilter === 'all' || team.division_id === divisionFilter
    const matchesStatus = statusFilter === 'all' || team.status === statusFilter

    return matchesSearch && matchesDivision && matchesStatus
  })

  const handleStatusChange = async (teamId: string, status: TeamStatus) => {
    try {
      await updateTeamStatus(eventId, teamId, status, eventSlug)
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Failed to update status')
    }
  }

  const handleWithdraw = async (teamId: string) => {
    if (!confirm('Withdraw this team?')) return
    try {
      await withdrawTeam(eventId, teamId, eventSlug)
    } catch (err) {
      console.error('Error withdrawing team:', err)
      alert('Failed to withdraw team')
    }
  }

  const handleRefund = async (teamId: string) => {
    if (!confirm('Refund this team? This will trigger a full refund in Stripe and withdraw the team.')) return
    
    setIsRefunding(teamId)
    try {
      await refundTeam(eventId, teamId, eventSlug)
      alert('Refund processed successfully')
    } catch (err: unknown) {
      console.error('Error refunding team:', err)
      const message = err instanceof Error ? err.message : 'Failed to refund team'
      alert(message)
    } finally {
      setIsRefunding(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search teams or captains..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-sm font-bold"
          />
        </div>
        <select
          value={divisionFilter}
          onChange={(e) => setDivisionFilter(e.target.value)}
          className="px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-sm font-bold"
        >
          <option value="all">All Divisions</option>
          {divisions.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-sm font-bold"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="waitlisted">Waitlisted</option>
          <option value="withdrawn">Withdrawn</option>
        </select>
      </div>

      {/* Team Table */}
      <div className="bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Team Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Division</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Captain</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
              {filteredTeams.length > 0 ? filteredTeams.map((team) => (
                <tr key={team.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-black text-black dark:text-white uppercase tracking-tight">{team.team_name}</p>
                    {team.club_name && <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{team.club_name}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{team.division?.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-black dark:text-white">{team.captain_name}</p>
                    <p className="text-xs text-zinc-400 font-medium">{team.captain_email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={team.status}
                      onChange={(e) => handleStatusChange(team.id, e.target.value as TeamStatus)}
                      className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border-0 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all ${
                        team.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        team.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        team.status === 'waitlisted' ? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="waitlisted">Waitlist</option>
                      <option value="withdrawn">Withdrawn</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button
                        onClick={() => setEditingTeam(team)}
                        className="p-2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                        title="Edit Team"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {team.status === 'paid' && (
                        <button
                          onClick={() => handleRefund(team.id)}
                          disabled={isRefunding === team.id}
                          className={`p-2 transition-colors ${isRefunding === team.id ? 'text-zinc-200 cursor-not-allowed' : 'text-zinc-400 hover:text-orange-600'}`}
                          title="Refund & Withdraw"
                        >
                          {isRefunding === team.id ? (
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </button>
                      )}
                      {team.status !== 'withdrawn' && (
                        <button
                          onClick={() => handleWithdraw(team.id)}
                          className="p-2 text-zinc-400 hover:text-red-600 transition-colors"
                          title="Withdraw Team"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">No teams found matching your search</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingTeam && (
        <TeamEditForm
          eventId={eventId}
          eventSlug={eventSlug}
          team={editingTeam}
          onClose={() => setEditingTeam(null)}
        />
      )}
    </div>
  )
}
