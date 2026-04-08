'use client'

import { useState } from 'react'
import { Announcement } from '@/types'
import AnnouncementForm from './AnnouncementForm'

interface AnnouncementListProps {
  eventId: string
  eventSlug: string
  initialAnnouncements: Announcement[]
}

export default function AnnouncementList({ eventId, eventSlug, initialAnnouncements }: AnnouncementListProps) {
  const [announcements] = useState<Announcement[]>(initialAnnouncements)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const handleSuccess = () => {
    setIsAdding(false)
    setEditingId(null)
    // Next.js will revalidatePath via the server action, 
    // but we could also manually refresh or update local state if needed.
    // For now, relying on revalidatePath and page reload if necessary.
    window.location.reload() 
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter">Event Announcements</h2>
        {!isAdding && !editingId && (
          <button 
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity uppercase text-xs tracking-tighter"
          >
            + New Announcement
          </button>
        )}
      </div>

      {isAdding && (
        <AnnouncementForm 
          eventId={eventId} 
          eventSlug={eventSlug}
          onCancel={() => setIsAdding(false)} 
          onSuccess={handleSuccess}
        />
      )}

      <div className="grid grid-cols-1 gap-4">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div key={announcement.id}>
              {editingId === announcement.id ? (
                <AnnouncementForm 
                  eventId={eventId}
                  eventSlug={eventSlug}
                  announcementId={announcement.id}
                  initialData={announcement}
                  onCancel={() => setEditingId(null)}
                  onSuccess={handleSuccess}
                />
              ) : (
                <div className={`p-6 bg-white dark:bg-zinc-950 border ${announcement.is_urgent ? 'border-red-200 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10' : 'border-zinc-200 dark:border-zinc-800'} rounded-2xl group hover:shadow-md transition-all`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {announcement.is_urgent && (
                          <span className="px-1.5 py-0.5 bg-red-600 text-white text-[8px] font-black uppercase tracking-widest rounded">URGENT</span>
                        )}
                        <h4 className="font-black text-black dark:text-white uppercase tracking-tight">{announcement.title}</h4>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
                        {announcement.content}
                      </p>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                        Published {new Date(announcement.published_at).toLocaleString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => setEditingId(announcement.id)}
                      className="p-2 text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : !isAdding && (
          <div className="p-12 border-2 border-dashed border-zinc-200 dark:border-zinc-900 rounded-3xl text-center bg-zinc-50/50 dark:bg-zinc-950/50">
            <p className="text-zinc-500 font-bold uppercase tracking-tighter">No announcements yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
