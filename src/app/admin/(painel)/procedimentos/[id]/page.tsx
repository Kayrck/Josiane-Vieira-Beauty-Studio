import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProcedureForm } from '@/components/admin/ProcedureForm'
import { getAdminProcedure } from '@/lib/catalog/admin-queries'
import { isUuid } from '@/lib/catalog/validation'

export const metadata: Metadata = { title: 'Editar procedimento' }

export default async function EditProcedurePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!isUuid(id)) notFound()

  const { procedure, categories } = await getAdminProcedure(id)
  if (!procedure) notFound()

  // key: ao navegar de um procedimento para outro, o formulário recomeça do zero
  return <ProcedureForm key={procedure.id} mode="edit" categories={categories} initial={procedure} />
}
