import DivisionForm from '@/components/admin/DivisionForm'

export default async function NewDivisionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="p-8 lg:p-12">
      <DivisionForm eventId={id} />
    </div>
  )
}
