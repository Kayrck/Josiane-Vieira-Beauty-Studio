import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { ProcedureList } from '@/components/admin/ProcedureList'
import { buttonClass } from '@/components/admin/styles'
import { getAdminCatalog } from '@/lib/catalog/admin-queries'

export const metadata: Metadata = { title: 'Procedimentos' }

export default async function AdminHomePage() {
  const { procedures, categories } = await getAdminCatalog()

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="tracking-luxe text-[10px] uppercase text-gold">Visão geral</p>
          <h1 className="mt-1 font-display text-[clamp(1.9rem,5vw,2.5rem)] leading-tight text-espresso">
            Procedimentos
          </h1>
          <p className="mt-1 text-espresso/60">Tudo o que você altera aqui aparece no site na hora.</p>
        </div>
        <Link href="/admin/procedimentos/novo" className={buttonClass('primary', 'w-full sm:w-auto')}>
          <Plus className="size-4" aria-hidden /> Novo procedimento
        </Link>
      </header>


      <ProcedureList procedures={procedures} categories={categories} />
    </div>
  )
}
