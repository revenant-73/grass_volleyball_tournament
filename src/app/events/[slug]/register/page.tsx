import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import RegistrationForm from '@/components/public/RegistrationForm'

export default async function RegistrationPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ divisionId?: string }>
}) {
  const { slug } = await params
  const { divisionId } = await searchParams
  const supabase = await createClient()

  const { data: event, error } = await supabase
    .from('events')
    .select(`
      *,
      divisions (*, teams(count))
    `)
    .eq('slug', slug)
    .single()

  if (error || !event || event.status === 'draft') {
    notFound()
  }

  // Pre-selected division if divisionId is in URL
  const selectedDivision = divisionId 
    ? event.divisions.find((d: any) => d.id === divisionId)
    : null

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <Link href={`/events/${slug}`} className="inline-flex items-center text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-black dark:hover:text-white transition-colors mb-8 group">
            <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Event
          </Link>
          <h1 className="text-4xl lg:text-5xl font-black text-black dark:text-white uppercase tracking-tighter mb-4 leading-tight">
            Register for {event.name}
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-tight">
            {new Date(event.date_start).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • {event.location_name}
          </p>
        </header>

        <RegistrationForm 
          event={event} 
          initialDivisionId={divisionId}
        />
      </div>
    </div>
  )
}
