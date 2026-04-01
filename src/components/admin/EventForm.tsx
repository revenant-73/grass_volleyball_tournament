'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createEvent, updateEvent } from '@/app/admin/events/actions'
import { Event } from '@/types'
import Image from 'next/image'

interface EventFormProps {
  initialData?: Event
  id?: string
}

export default function EventForm({ initialData, id }: EventFormProps) {
  const [step, setStep] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    date_start: initialData?.date_start || '',
    date_end: initialData?.date_end || '',
    check_in_time: initialData?.check_in_time || '',
    start_time: initialData?.start_time || '',
    location_name: initialData?.location_name || '',
    location_address: initialData?.location_address || '',
    status: initialData?.status || 'draft',
    registration_open_at: initialData?.registration_open_at?.split('T')[0] || '',
    registration_close_at: initialData?.registration_close_at?.split('T')[0] || '',
  })

  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(initialData?.banner_url || null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setBannerFile(file)
      setBannerPreview(URL.createObjectURL(file))
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
    
    if (bannerFile) {
      submissionData.append('banner', bannerFile)
    }

    try {
      if (id) {
        await updateEvent(id, submissionData)
      } else {
        await createEvent(submissionData)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      setLoading(false)
    }
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-12 pb-8 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-4 mb-4">
          <Link 
            href={id ? `/admin/events/${id}` : "/admin/events"}
            className="p-2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter">
            {id ? 'Edit Event' : 'Create New Event'}
          </h1>
        </div>
        
        {/* Progress Stepper */}
        <div className="flex items-center gap-4 ml-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                step === s ? 'bg-black text-white dark:bg-white dark:text-black' : 
                step > s ? 'bg-green-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
              }`}>
                {step > s ? '✓' : s}
              </div>
              {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-green-500' : 'bg-zinc-100 dark:bg-zinc-800'}`} />}
            </div>
          ))}
          <span className="ml-4 text-xs font-black uppercase tracking-widest text-zinc-400">
            {step === 1 ? 'Basic Info' : step === 2 ? 'Schedule & Location' : 'Review & Publish'}
          </span>
        </div>
      </header>

      {error && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/30 font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="name">
                  Event Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Seaside Grass Doubles Open"
                  className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="slug">
                  URL Slug (Optional)
                </label>
                <div className="flex items-center">
                  <span className="px-4 py-4 bg-zinc-50 dark:bg-zinc-800 border-2 border-r-0 border-zinc-100 dark:border-zinc-800 rounded-l-xl text-zinc-400 text-sm font-bold">
                    /events/
                  </span>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="seaside-open-2026"
                    className="flex-1 px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-r-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                  />
                </div>
                <p className="mt-2 text-xs text-zinc-400 font-bold italic ml-1">Leave empty to auto-generate from name.</p>
              </div>

              <div>
                <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell players about the tournament, rules, prizes, etc."
                  className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3">
                  Banner Image
                </label>
                <div className="mt-2 flex items-center gap-8">
                  <div className="relative w-40 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-xl overflow-hidden border-2 border-zinc-100 dark:border-zinc-800 flex items-center justify-center">
                    {bannerPreview ? (
                      <Image src={bannerPreview} alt="Banner Preview" fill className="object-cover" unoptimized />
                    ) : (
                      <svg className="w-8 h-8 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="banner-upload"
                  />
                  <label 
                    htmlFor="banner-upload"
                    className="px-6 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold rounded-lg cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors uppercase text-xs tracking-widest"
                  >
                    {bannerPreview ? 'Change Image' : 'Upload Image'}
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Schedule & Location */}
        {step === 2 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="space-y-8">
              <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter">Scheduling</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="date_start">
                    Start Date *
                  </label>
                  <input
                    id="date_start"
                    name="date_start"
                    type="date"
                    required
                    value={formData.date_start}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="date_end">
                    End Date (Optional)
                  </label>
                  <input
                    id="date_end"
                    name="date_end"
                    type="date"
                    value={formData.date_end}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="check_in_time">
                    Check-in Time
                  </label>
                  <input
                    id="check_in_time"
                    name="check_in_time"
                    type="time"
                    value={formData.check_in_time}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="start_time">
                    First Serve Time
                  </label>
                  <input
                    id="start_time"
                    name="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                  />
                </div>
              </div>
            </section>

            <section className="pt-12 border-t border-zinc-100 dark:border-zinc-900 space-y-8">
              <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter">Registration Window</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="registration_open_at">
                    Opens At
                  </label>
                  <input
                    id="registration_open_at"
                    name="registration_open_at"
                    type="date"
                    value={formData.registration_open_at}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="registration_close_at">
                    Closes At
                  </label>
                  <input
                    id="registration_close_at"
                    name="registration_close_at"
                    type="date"
                    value={formData.registration_close_at}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                  />
                </div>
              </div>
            </section>

            <section className="pt-12 border-t border-zinc-100 dark:border-zinc-900 space-y-8">
              <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter">Location</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="location_name">
                    Venue Name
                  </label>
                  <input
                    id="location_name"
                    name="location_name"
                    type="text"
                    value={formData.location_name}
                    onChange={handleChange}
                    placeholder="e.g. Seaside Park"
                    className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-zinc-400 uppercase tracking-widest mb-3" htmlFor="location_address">
                    Full Address
                  </label>
                  <input
                    id="location_address"
                    name="location_address"
                    type="text"
                    value={formData.location_address}
                    onChange={handleChange}
                    placeholder="e.g. 123 Ocean Blvd, Beach City, CA"
                    className="w-full px-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Step 3: Review & Publish */}
        {step === 3 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="space-y-8">
              <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter">Final Review</h2>
              <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl space-y-6">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Event Name</p>
                    <p className="font-bold text-black dark:text-white">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Status</p>
                    <select 
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="bg-transparent font-black uppercase text-sm tracking-tighter outline-none text-black dark:text-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="open">Open (Publicly Visible)</option>
                      <option value="closed">Closed (No more signups)</option>
                      <option value="live">Live (Ongoing)</option>
                      <option value="complete">Complete</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Date</p>
                    <p className="font-bold text-black dark:text-white">{formData.date_start}{formData.date_end && formData.date_end !== formData.date_start ? ` - ${formData.date_end}` : ''}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Location</p>
                    <p className="font-bold text-black dark:text-white">{formData.location_name || 'TBD'}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-12 border-t border-zinc-100 dark:border-zinc-900 flex justify-between gap-4">
          <button
            type="button"
            onClick={step === 1 ? undefined : prevStep}
            className={`px-8 py-4 text-black dark:text-white font-black rounded-xl transition-colors uppercase tracking-tighter ${
              step === 1 ? 'opacity-0 pointer-events-none' : 'bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            Back
          </button>
          <div className="flex gap-4">
            <Link 
              href={id ? `/admin/events/${id}` : "/admin/events"}
              className="px-8 py-4 bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white font-black rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors uppercase tracking-tighter"
            >
              Cancel
            </Link>
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-12 py-4 bg-black text-white dark:bg-white dark:text-black font-black rounded-xl hover:opacity-90 transition-opacity uppercase tracking-tighter"
              >
                Next Step
              </button>
            ) : (
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
                {id ? 'Save Changes' : 'Create Event'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
