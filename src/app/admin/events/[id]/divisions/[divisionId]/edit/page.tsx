import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import DivisionForm from '@/components/admin/DivisionForm'

export default async function EditDivisionPage({
  params,
}: {
  params: Promise<{ id: string, divisionId: string }>
}) {
  const { id, divisionId } = await params
  const supabase = await createClient()
  
  const { data: division, error } = await supabase
    .from('divisions')
    .select('*')
    .eq('id', divisionId)
    .single()

  if (error || !division) {
    notFound()
  }

  return (
    <div className="p-8 lg:p-12">
      <DivisionForm eventId={id} divisionId={divisionId} initialData={division} />
    </div>
  )
}
