import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import EventForm from '@/components/admin/EventForm'

export default async function EditEventPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !event) {
    notFound()
  }

  return (
    <div className="p-8 lg:p-12">
      <EventForm initialData={event} id={params.id} />
    </div>
  )
}
