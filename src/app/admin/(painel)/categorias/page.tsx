import type { Metadata } from 'next'
import { CategoryManager } from '@/components/admin/CategoryManager'
import { getAdminCatalog } from '@/lib/catalog/admin-queries'

export const metadata: Metadata = { title: 'Categorias' }

export default async function CategoriesPage() {
  const { procedures, categories } = await getAdminCatalog()

  const counts = new Map<string, number>()
  for (const p of procedures) counts.set(p.categoryId, (counts.get(p.categoryId) ?? 0) + 1)

  return (
    <div className="space-y-6">
      <header>
        <p className="tracking-luxe text-[10px] uppercase text-gold">Organização</p>
        <h1 className="mt-1 font-display text-[clamp(1.9rem,5vw,2.5rem)] leading-tight text-espresso">Categorias</h1>
        <p className="mt-1 text-espresso/60">
          Agrupam os procedimentos no site. Só aparecem para as clientes as categorias que têm procedimentos ativos.
        </p>
      </header>

      <CategoryManager categories={categories.map((c) => ({ ...c, count: counts.get(c.id) ?? 0 }))} />
    </div>
  )
}
