'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Announcement } from '@/types'
import { createAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/app/admin/events/[id]/announcements/actions'

interface AnnouncementFormProps {
  eventId: string
  initialData?: Announcement
  announcementId?: string
  onCancel: () => void
  onSuccess: () => void
}

export default function AnnouncementForm({ eventId, initialData, announcementId, onCancel, onSuccess }: AnnouncementFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    is_urgent: initialData?.is_urgent || false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      if (announcementId) {
        await updateAnnouncement(eventId, announcementId, submissionData)
      } else {
        await createAnnouncement(eventId, submissionData)
      }
      onSuccess()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!announcementId) return
    if (!confirm('Are you sure you want to delete this announcement?')) return
    
    setLoading(true)
    try {
      await deleteAnnouncement(eventId, announcementId)
      onSuccess()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl">
      <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter mb-8">
        {announcementId ? 'Edit Announcement' : 'Post New Announcement'}
      </h2>

      {error && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/30 font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Schedule Update"
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={4}
            value={formData.content}
            onChange={handleChange}
            placeholder="What do players need to know?"
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold resize-none"
          />
        </div>

        <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border-2 border-zinc-100 dark:border-zinc-800">
          <input
            id="is_urgent"
            name="is_urgent"
            type="checkbox"
            checked={formData.is_urgent}
            onChange={handleChange}
            className="w-5 h-5 accent-red-600"
          />
          <label htmlFor="is_urgent" className="text-sm font-bold text-red-600 uppercase tracking-tight">
            Mark as Urgent (Shows in red banner)
          </label>
        </div>

        <div className="pt-6 flex justify-between items-center gap-4">
          <div>
            {announcementId && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 text-red-600 dark:text-red-400 font-bold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors uppercase text-xs tracking-tighter"
              >
                Delete
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white font-bold rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors uppercase text-xs tracking-tighter"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-black text-white dark:bg-white dark:text-black font-black rounded-xl hover:opacity-90 transition-opacity uppercase text-xs tracking-tighter disabled:opacity-50 flex items-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {announcementId ? 'Update' : 'Post Announcement'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
