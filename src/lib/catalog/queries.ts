// Leitura do catálogo PÚBLICO (somente procedimentos ativos).
// Uma única consulta traz os procedimentos e suas categorias.

import { isSupabaseConfigured } from '@/lib/supabase/env'
import { createSupabasePublicClient } from '@/lib/supabase/public'
import { FALLBACK_CATEGORIES, FALLBACK_PROCEDURES } from './fallback'
import {
  PROCEDURE_COLUMNS,
  toCategory,
  toProcedure,
  type Category,
  type CategoryRow,
  type Procedure,
  type ProcedureRow,
} from './types'

export type PublicCatalog = {
  procedures: Procedure[]
  categories: Category[]
  /** 'fallback' só acontece quando o Supabase ainda não foi configurado. */
  source: 'database' | 'fallback'
}

type PublicRow = ProcedureRow & { category: CategoryRow | null }

export async function getPublicCatalog(): Promise<PublicCatalog> {
  if (!isSupabaseConfigured()) {
    console.warn(
      '[catálogo] Supabase não configurado: exibindo o catálogo de contingência. ' +
        'Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (veja docs/ADMIN-SETUP.md).',
    )
    return { procedures: FALLBACK_PROCEDURES, categories: FALLBACK_CATEGORIES, source: 'fallback' }
  }

  const supabase = createSupabasePublicClient()
  const { data, error } = await supabase
    .from('procedures')
    .select(`${PROCEDURE_COLUMNS}, category:categories(id, slug, name, sort_order)`)
    .eq('active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  // Erro de leitura NUNCA vira dados antigos: a página mantém a última versão válida
  // (ISR) e o problema fica visível nos logs.
  if (error) throw new Error(`Não foi possível carregar os procedimentos: ${error.message}`)

  const rows = (data ?? []) as unknown as PublicRow[]
  const procedures = rows.map(toProcedure)

  const byId = new Map<string, Category>()
  for (const row of rows) {
    if (row.category && !byId.has(row.category.id)) byId.set(row.category.id, toCategory(row.category))
  }
  const categories = [...byId.values()].sort(
    (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, 'pt-BR'),
  )

  return { procedures, categories, source: 'database' }
}
