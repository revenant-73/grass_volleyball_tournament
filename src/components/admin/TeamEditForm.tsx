'use client'

import { useState } from 'react'
import { Team, TeamStatus } from '@/types'
import { updateTeam } from '@/app/admin/events/[id]/registrations/actions'

interface TeamEditFormProps {
  eventId: string
  eventSlug: string
  team: Team
  onClose: () => void
}

export default function TeamEditForm({ eventId, eventSlug, team, onClose }: TeamEditFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    team_name: team.team_name || '',
    captain_name: team.captain_name || '',
    captain_email: team.captain_email || '',
    captain_phone: team.captain_phone || '',
    partner_name: team.partner_name || '',
    partner_email: team.partner_email || '',
    partner_phone: team.partner_phone || '',
    club_name: team.club_name || '',
    city: team.city || '',
    status: team.status as TeamStatus,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const submissionData = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      submissionData.append(key, value)
    })

    try {
      await updateTeam(eventId, team.id, submissionData, eventSlug)
      onClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-950 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 lg:p-12 shadow-2xl animate-in fade-in zoom-in duration-200">
        <header className="flex justify-between items-center mb-8 pb-6 border-b border-zinc-100 dark:border-zinc-900">
          <div>
            <h2 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter">Edit Team</h2>
            <p className="text-sm font-bold text-zinc-400 mt-1 uppercase tracking-widest">{team.division?.name}</p>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/30 font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="team_name">
                Team Name *
              </label>
              <input
                id="team_name"
                name="team_name"
                type="text"
                required
                value={formData.team_name}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-zinc-50 dark:border-zinc-900">
              <div className="col-span-1 sm:col-span-2">
                <h4 className="text-xs font-black text-zinc-300 uppercase tracking-widest mb-2">Captain Information</h4>
              </div>
              <div>
                <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="captain_name">
                  Captain Name *
                </label>
                <input
                  id="captain_name"
                  name="captain_name"
                  type="text"
                  required
                  value={formData.captain_name}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="captain_email">
                  Captain Email *
                </label>
                <input
                  id="captain_email"
                  name="captain_email"
                  type="email"
                  required
                  value={formData.captain_email}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-zinc-50 dark:border-zinc-900">
              <div className="col-span-1 sm:col-span-2">
                <h4 className="text-xs font-black text-zinc-300 uppercase tracking-widest mb-2">Partner Information</h4>
              </div>
              <div>
                <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="partner_name">
                  Partner Name
                </label>
                <input
                  id="partner_name"
                  name="partner_name"
                  type="text"
                  value={formData.partner_name}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="partner_email">
                  Partner Email
                </label>
                <input
                  id="partner_email"
                  name="partner_email"
                  type="email"
                  value={formData.partner_email}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-zinc-50 dark:border-zinc-900">
               <div>
                <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="waitlisted">Waitlisted</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>
               <div>
                <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="club_name">
                  Club / City
                </label>
                <input
                  id="club_name"
                  name="club_name"
                  type="text"
                  value={formData.club_name}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-100 dark:border-zinc-900 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white font-black rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors uppercase tracking-tighter"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-12 py-4 bg-black text-white dark:bg-white dark:text-black font-black rounded-xl hover:opacity-90 transition-opacity uppercase tracking-tighter disabled:opacity-50 flex items-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
