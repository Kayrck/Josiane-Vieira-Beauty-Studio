import type { Metadata } from 'next'
import { ProcedureForm } from '@/components/admin/ProcedureForm'
import { getAdminCategories } from '@/lib/catalog/admin-queries'

export const metadata: Metadata = { title: 'Novo procedimento' }

export default async function NewProcedurePage() {
  const categories = await getAdminCategories()
  return <ProcedureForm mode="create" categories={categories} />
}
