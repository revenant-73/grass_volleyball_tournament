'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Sponsor } from '@/types'
import { createSponsor, updateSponsor, deleteSponsor } from '@/app/admin/events/[id]/sponsors/actions'

interface SponsorFormProps {
  eventId: string
  initialData?: Sponsor
  sponsorId?: string
  onCancel: () => void
  onSuccess: () => void
}

export default function SponsorForm({ eventId, initialData, sponsorId, onCancel, onSuccess }: SponsorFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.logo_url || null)

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    website_url: initialData?.website_url || '',
    display_order: initialData?.display_order?.toString() || '0',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const submissionData = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      submissionData.append(key, value)
    })

    const fileInput = document.getElementById('logo') as HTMLInputElement
    if (fileInput?.files?.[0]) {
      submissionData.append('logo', fileInput.files[0])
    }

    try {
      if (sponsorId) {
        await updateSponsor(eventId, sponsorId, submissionData)
      } else {
        await createSponsor(eventId, submissionData)
      }
      onSuccess()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!sponsorId) return
    if (!confirm('Are you sure you want to delete this sponsor?')) return
    
    setLoading(true)
    try {
      await deleteSponsor(eventId, sponsorId)
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
        {sponsorId ? 'Edit Sponsor' : 'Add New Sponsor'}
      </h2>

      {error && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/30 font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2" htmlFor="name">
                Sponsor Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. VolleyGear Inc."
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2" htmlFor="website_url">
                Website URL
              </label>
              <input
                id="website_url"
                name="website_url"
                type="url"
                value={formData.website_url}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2" htmlFor="display_order">
                Display Order
              </label>
              <input
                id="display_order"
                name="display_order"
                type="number"
                value={formData.display_order}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
              />
            </div>
          </div>

          <div className="w-full md:w-64">
            <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">
              Sponsor Logo
            </label>
            <div className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
              {previewUrl ? (
                <Image 
                  src={previewUrl} 
                  alt="Preview" 
                  fill 
                  className="object-contain p-4"
                  unoptimized
                />
              ) : (
                <div className="text-center p-4">
                  <svg className="w-8 h-8 text-zinc-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Click to upload</p>
                </div>
              )}
              <input
                type="file"
                id="logo"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 flex justify-between items-center gap-4 border-t border-zinc-100 dark:border-zinc-900">
          <div>
            {sponsorId && (
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
              {sponsorId ? 'Update Sponsor' : 'Add Sponsor'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
