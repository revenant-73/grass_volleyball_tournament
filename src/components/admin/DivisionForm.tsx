'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Division } from '@/types'
import { createDivision, updateDivision, deleteDivision } from '@/app/admin/events/[id]/divisions/actions'

interface DivisionFormProps {
  eventId: string
  initialData?: Division
  divisionId?: string
}

export default function DivisionForm({ eventId, initialData, divisionId }: DivisionFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    level: initialData?.level || 'Open',
    format_type: initialData?.format_type || 'Pool to Bracket',
    team_cap: initialData?.team_cap?.toString() || '16',
    price: (initialData?.price_cents ? initialData.price_cents / 100 : 80).toString(),
    waitlist_enabled: initialData?.waitlist_enabled || false,
    teams_advance_count: initialData?.teams_advance_count?.toString() || '2',
    bracket_type: initialData?.bracket_type || 'single_elimination',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const submissionData = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'boolean') {
        if (value) submissionData.append(key, 'on')
      } else {
        submissionData.append(key, value)
      }
    })

    try {
      if (divisionId) {
        await updateDivision(eventId, divisionId, submissionData)
      } else {
        await createDivision(eventId, submissionData)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!divisionId) return
    if (!confirm('Are you sure you want to delete this division? This cannot be undone.')) return
    
    setLoading(true)
    try {
      await deleteDivision(eventId, divisionId)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-12 pb-8 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-4 mb-4">
          <Link 
            href={`/admin/events/${eventId}`}
            className="p-2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter">
            {divisionId ? 'Edit Division' : 'Add New Division'}
          </h1>
        </div>
      </header>

      {error && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/30 font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="name">
                Division Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Mens Open"
                className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="level">
                  Level / Skill
                </label>
                <input
                  id="level"
                  name="level"
                  type="text"
                  value={formData.level}
                  onChange={handleChange}
                  placeholder="e.g. Pro/AA"
                  className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="price">
                  Registration Price ($)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="team_cap">
                  Team Capacity
                </label>
                <input
                  id="team_cap"
                  name="team_cap"
                  type="number"
                  value={formData.team_cap}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="teams_advance_count">
                  Teams Advancing per Pool
                </label>
                <input
                  id="teams_advance_count"
                  name="teams_advance_count"
                  type="number"
                  value={formData.teams_advance_count}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="format_type">
                Format
              </label>
              <select
                id="format_type"
                name="format_type"
                value={formData.format_type}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
              >
                <option value="Pool to Bracket">Pool Play to Single Elim Bracket</option>
                <option value="Double Elimination">Double Elimination Bracket</option>
                <option value="Round Robin">Round Robin Only</option>
              </select>
            </div>

            <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border-2 border-zinc-100 dark:border-zinc-800">
              <input
                id="waitlist_enabled"
                name="waitlist_enabled"
                type="checkbox"
                checked={formData.waitlist_enabled}
                onChange={handleChange}
                className="w-5 h-5 accent-black dark:accent-white"
              />
              <label htmlFor="waitlist_enabled" className="text-sm font-bold text-black dark:text-white uppercase tracking-tight">
                Enable Waitlist after capacity is reached
              </label>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-zinc-100 dark:border-zinc-900 flex justify-between items-center gap-4">
          <div>
            {divisionId && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-6 py-4 text-red-600 dark:text-red-400 font-black rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors uppercase tracking-tighter"
              >
                Delete Division
              </button>
            )}
          </div>
          <div className="flex gap-4">
            <Link 
              href={`/admin/events/${eventId}`}
              className="px-8 py-4 bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white font-black rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors uppercase tracking-tighter"
            >
              Cancel
            </Link>
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
              {divisionId ? 'Save Changes' : 'Add Division'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
