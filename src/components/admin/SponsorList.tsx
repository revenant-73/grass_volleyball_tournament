'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Sponsor } from '@/types'
import SponsorForm from './SponsorForm'

interface SponsorListProps {
  eventId: string
  initialSponsors: Sponsor[]
}

export default function SponsorList({ eventId, initialSponsors }: SponsorListProps) {
  const [sponsors, setSponsors] = useState<Sponsor[]>(initialSponsors)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const handleSuccess = () => {
    setIsAdding(false)
    setEditingId(null)
    window.location.reload() 
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter">Event Sponsors</h2>
        {!isAdding && !editingId && (
          <button 
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity uppercase text-xs tracking-tighter"
          >
            + Add Sponsor
          </button>
        )}
      </div>

      {isAdding && (
        <SponsorForm 
          eventId={eventId} 
          onCancel={() => setIsAdding(false)} 
          onSuccess={handleSuccess}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sponsors.length > 0 ? (
          sponsors.map((sponsor) => (
            <div key={sponsor.id} className="h-full">
              {editingId === sponsor.id ? (
                <div className="md:col-span-2">
                  <SponsorForm 
                    eventId={eventId}
                    sponsorId={sponsor.id}
                    initialData={sponsor}
                    onCancel={() => setEditingId(null)}
                    onSuccess={handleSuccess}
                  />
                </div>
              ) : (
                <div className="h-full p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl group hover:shadow-md transition-all flex items-center gap-6">
                  <div className="w-20 h-20 relative flex-shrink-0 bg-zinc-50 dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
                    {sponsor.logo_url ? (
                      <Image 
                        src={sponsor.logo_url} 
                        alt={sponsor.name} 
                        fill 
                        className="object-contain p-2"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-zinc-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-black dark:text-white uppercase tracking-tight">{sponsor.name}</h4>
                    {sponsor.website_url && (
                      <a 
                        href={sponsor.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-zinc-400 hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest block mt-1"
                      >
                        Visit Website
                      </a>
                    )}
                  </div>
                  <button 
                    onClick={() => setEditingId(sponsor.id)}
                    className="p-2 text-zinc-300 hover:text-black dark:hover:text-white transition-colors flex-shrink-0"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))
        ) : !isAdding && (
          <div className="md:col-span-2 p-12 border-2 border-dashed border-zinc-200 dark:border-zinc-900 rounded-3xl text-center bg-zinc-50/50 dark:bg-zinc-950/50">
            <p className="text-zinc-500 font-bold uppercase tracking-tighter">No sponsors yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
