// Leitura do catálogo COMPLETO (ativos + inativos) para o painel.
// Cada função confere o acesso por conta própria (não depende do layout): em Next.js
// layouts não são reexecutados a cada navegação, então a checagem fica junto dos dados.

import { requireAdmin } from '@/lib/auth'
import {
  CATEGORY_COLUMNS,
  PROCEDURE_COLUMNS,
  toCategory,
  toProcedure,
  type Category,
  type CategoryRow,
  type Procedure,
  type ProcedureRow,
} from './types'

export type AdminCatalog = {
  procedures: Procedure[]
  categories: Category[]
}

export async function getAdminCatalog(): Promise<AdminCatalog> {
  const { supabase } = await requireAdmin()

  const [procs, cats] = await Promise.all([
    supabase
      .from('procedures')
      .select(PROCEDURE_COLUMNS)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true }),
    supabase
      .from('categories')
      .select(CATEGORY_COLUMNS)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true }),
  ])

  if (procs.error) throw new Error(`Não foi possível carregar os procedimentos: ${procs.error.message}`)
  if (cats.error) throw new Error(`Não foi possível carregar as categorias: ${cats.error.message}`)

  return {
    procedures: ((procs.data ?? []) as unknown as ProcedureRow[]).map(toProcedure),
    categories: ((cats.data ?? []) as unknown as CategoryRow[]).map(toCategory),
  }
}

export async function getAdminCategories(): Promise<Category[]> {
  const { supabase } = await requireAdmin()

  const { data, error } = await supabase
    .from('categories')
    .select(CATEGORY_COLUMNS)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) throw new Error(`Não foi possível carregar as categorias: ${error.message}`)
  return ((data ?? []) as unknown as CategoryRow[]).map(toCategory)
}

export async function getAdminProcedure(id: string): Promise<{ procedure: Procedure | null; categories: Category[] }> {
  const { supabase } = await requireAdmin()

  const [proc, cats] = await Promise.all([
    supabase.from('procedures').select(PROCEDURE_COLUMNS).eq('id', id).maybeSingle(),
    supabase
      .from('categories')
      .select(CATEGORY_COLUMNS)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true }),
  ])

  if (proc.error) throw new Error(`Não foi possível carregar o procedimento: ${proc.error.message}`)
  if (cats.error) throw new Error(`Não foi possível carregar as categorias: ${cats.error.message}`)

  return {
    procedure: proc.data ? toProcedure(proc.data as unknown as ProcedureRow) : null,
    categories: ((cats.data ?? []) as unknown as CategoryRow[]).map(toCategory),
  }
}
