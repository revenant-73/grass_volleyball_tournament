import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import SponsorList from '@/components/admin/SponsorList'

export default async function AdminSponsorsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('name')
    .eq('id', id)
    .single()

  if (eventError || !event) {
    notFound()
  }

  const { data: sponsors, error: sponsorsError } = await supabase
    .from('sponsors')
    .select('*')
    .eq('event_id', id)
    .order('display_order', { ascending: true })

  if (sponsorsError) {
    console.error('Error fetching sponsors:', sponsorsError)
  }

  return (
    <div className="p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 pb-8 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href={`/admin/events/${id}`}
              className="p-2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{event.name}</p>
              <h1 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter">
                Manage Sponsors
              </h1>
            </div>
          </div>
        </header>

        <SponsorList 
          eventId={id} 
          initialSponsors={sponsors || []} 
        />
      </div>
    </div>
  )
}
