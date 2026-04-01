'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Event, Division } from '@/types'
import { registerTeam } from '@/app/events/[slug]/register/actions'

interface RegistrationFormProps {
  event: Event & { divisions: (Division & { teams?: { count: number }[] })[] }
  initialDivisionId?: string
}

export default function RegistrationForm({ event, initialDivisionId }: RegistrationFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    division_id: initialDivisionId || '',
    team_name: '',
    captain_name: '',
    captain_email: '',
    captain_phone: '',
    partner_name: '',
    partner_email: '',
    partner_phone: '',
    club_name: '',
    city: '',
    waiver_accepted: false,
  })

  const selectedDivision = event.divisions.find(d => d.id === formData.division_id)
  const isFull = selectedDivision ? (selectedDivision.teams?.[0]?.count || 0) >= (selectedDivision.team_cap || 0) : false
  const waitlistEnabled = selectedDivision?.waitlist_enabled || false

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

    if (!formData.waiver_accepted) {
      setError('You must accept the waiver to register.')
      setLoading(false)
      return
    }

    try {
      const result = await registerTeam(event.id, formData)
      if (result.success) {
        if (result.redirectUrl) {
          router.push(result.redirectUrl)
        } else {
          // Fallback if no URL
          alert('Registration successful! Confirmation pending.')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12 pb-24">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-2xl border border-red-100 dark:border-red-900/30 font-bold">
          {error}
        </div>
      )}

      {/* Division Selection */}
      <section className="space-y-6">
        <h2 className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.3em]">1. Select Your Division</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {event.divisions.map((division) => {
            const teamCount = division.teams?.[0]?.count || 0
            const cap = division.team_cap || 0
            const isFull = teamCount >= cap
            const isSelected = formData.division_id === division.id

            return (
              <button
                key={division.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, division_id: division.id }))}
                className={`p-6 rounded-3xl border-2 text-left transition-all ${
                  isSelected 
                    ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black shadow-xl scale-[1.02]' 
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-600'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-black uppercase tracking-tighter">{division.name}</h3>
                  <p className="font-black text-lg tracking-tighter">${(division.price_cents || 0) / 100}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'opacity-60' : 'text-zinc-400'}`}>
                    {division.level} • {division.format_type}
                  </p>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${
                    isFull ? 'text-red-500' : isSelected ? 'opacity-60' : 'text-zinc-400'
                  }`}>
                    {isFull ? (division.waitlist_enabled ? 'WAITLIST ONLY' : 'SOLD OUT') : `${cap - teamCount} Spots Left`}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {formData.division_id && (
        <>
          {/* Team Info */}
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.3em]">2. Team Information</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2" htmlFor="team_name">
                  Team Name *
                </label>
                <input
                  id="team_name"
                  name="team_name"
                  type="text"
                  required
                  value={formData.team_name}
                  onChange={handleChange}
                  placeholder="The Net Rulers"
                  className="w-full px-6 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2" htmlFor="club_name">
                    Club / Organization
                  </label>
                  <input
                    id="club_name"
                    name="club_name"
                    type="text"
                    value={formData.club_name}
                    onChange={handleChange}
                    placeholder="Optional"
                    className="w-full px-6 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2" htmlFor="city">
                    Home City
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Optional"
                    className="w-full px-6 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Captain Info */}
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.3em]">3. Captain Info</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2" htmlFor="captain_name">
                  Full Name *
                </label>
                <input
                  id="captain_name"
                  name="captain_name"
                  type="text"
                  required
                  value={formData.captain_name}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2" htmlFor="captain_email">
                    Email Address *
                  </label>
                  <input
                    id="captain_email"
                    name="captain_email"
                    type="email"
                    required
                    value={formData.captain_email}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2" htmlFor="captain_phone">
                    Phone Number
                  </label>
                  <input
                    id="captain_phone"
                    name="captain_phone"
                    type="tel"
                    value={formData.captain_phone}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Partner Info */}
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.3em]">4. Partner Info</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2" htmlFor="partner_name">
                  Partner Name *
                </label>
                <input
                  id="partner_name"
                  name="partner_name"
                  type="text"
                  required
                  value={formData.partner_name}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2" htmlFor="partner_email">
                    Partner Email
                  </label>
                  <input
                    id="partner_email"
                    name="partner_email"
                    type="email"
                    value={formData.partner_email}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2" htmlFor="partner_phone">
                    Partner Phone
                  </label>
                  <input
                    id="partner_phone"
                    name="partner_phone"
                    type="tel"
                    value={formData.partner_phone}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white font-bold"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Waiver */}
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.3em]">5. Tournament Waiver</h2>
            <div className="p-8 bg-zinc-100 dark:bg-zinc-900 rounded-[2.5rem] border-2 border-zinc-200 dark:border-zinc-800">
              <div className="prose prose-zinc dark:prose-invert max-w-none h-48 overflow-y-auto mb-8 pr-4 custom-scrollbar">
                <p className="font-bold">Tournament Participation Waiver & Release of Liability</p>
                <p className="text-sm">I, the undersigned, understand that participating in grass volleyball tournaments involves risks of injury. I voluntarily assume all risks associated with participation, including but not limited to falls, contact with other participants, and the effects of weather. Having read this waiver and knowing these facts, I, for myself and anyone entitled to act on my behalf, waive and release the tournament organizers, sponsors, and venue from all claims or liabilities of any kind arising out of my participation.</p>
                <p className="text-sm">I also confirm that my partner has agreed to these terms or that I am authorized to sign on their behalf for the purpose of tournament registration.</p>
              </div>
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="mt-1">
                  <input
                    type="checkbox"
                    name="waiver_accepted"
                    checked={formData.waiver_accepted}
                    onChange={handleChange}
                    required
                    className="w-6 h-6 rounded-lg accent-black dark:accent-white"
                  />
                </div>
                <span className="text-sm font-black text-black dark:text-white uppercase tracking-tight group-hover:opacity-70 transition-opacity">
                  I have read and agree to the tournament waiver and confirm my partner&apos;s agreement.
                </span>
              </label>
            </div>
          </section>

          {/* Submit */}
          <div className="pt-12 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="submit"
              disabled={loading || !formData.waiver_accepted || (isFull && !waitlistEnabled)}
              className="w-full py-6 bg-black text-white dark:bg-white dark:text-black font-black rounded-3xl hover:opacity-90 transition-opacity uppercase tracking-widest shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading && (
                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isFull ? (waitlistEnabled ? 'Join Waitlist' : 'Sold Out') : 'Continue to Payment'}
            </button>
            <p className="text-center mt-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
              Secure Payment via Stripe
            </p>
          </div>
        </>
      )}
    </form>
  )
}
