// Tipos do catálogo de procedimentos (site público + painel administrativo).
// A fonte de verdade é o banco (Supabase). Os limites abaixo espelham, um a um,
// as constraints CHECK da migration `catalogo_e_painel_admin.sql`.

export const LIMITS = {
  nameMin: 2,
  nameMax: 80,
  descriptionMax: 300,
  priceMax: 99999.99,
  durationMin: 5,
  durationMax: 720,
  tagMax: 24,
  noteMax: 60,
  extraMax: 5,
  extraLabelMin: 2,
  extraLabelMax: 40,
  categoryNameMin: 2,
  categoryNameMax: 40,
} as const

/** Valor adicional com finalidade própria (ex.: "Manutenção", "Sem henna"). */
export type ExtraPrice = {
  label: string
  amount: number
}

export type Category = {
  id: string
  slug: string
  name: string
  sortOrder: number
}

export type Procedure = {
  id: string
  /** Identificador estável (nunca muda): usado nas mensagens de WhatsApp. */
  slug: string
  name: string
  description: string
  /** Valor principal (aplicação). */
  price: number
  /** Valores com finalidade própria: manutenção, variações etc. */
  extraPrices: ExtraPrice[]
  /** Observação curta exibida como etiqueta (ex.: "Exceto manutenção"). */
  priceNote: string | null
  durationMinutes: number
  categoryId: string
  image: string | null
  /** Selo de destaque sobre a foto (ex.: "Mais desejado"). */
  tag: string | null
  active: boolean
  sortOrder: number
  updatedAt: string | null
}

/** Linha crua como vem do PostgREST. */
export type ProcedureRow = {
  id: string
  slug: string
  name: string
  description: string | null
  price: number | string
  extra_prices: unknown
  price_note: string | null
  duration_minutes: number
  category_id: string
  image_url: string | null
  tag: string | null
  active: boolean
  sort_order: number
  updated_at: string | null
}

export type CategoryRow = {
  id: string
  slug: string
  name: string
  sort_order: number
}

export const PROCEDURE_COLUMNS =
  'id, slug, name, description, price, extra_prices, price_note, duration_minutes, category_id, image_url, tag, active, sort_order, updated_at'

export const CATEGORY_COLUMNS = 'id, slug, name, sort_order'

function toExtraPrices(value: unknown): ExtraPrice[] {
  if (!Array.isArray(value)) return []
  const out: ExtraPrice[] = []
  for (const item of value) {
    if (!item || typeof item !== 'object') continue
    const { label, amount } = item as { label?: unknown; amount?: unknown }
    const n = Number(amount)
    if (typeof label === 'string' && label.trim() && Number.isFinite(n)) {
      out.push({ label: label.trim(), amount: n })
    }
  }
  return out
}

export function toProcedure(row: ProcedureRow): Procedure {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? '',
    price: Number(row.price),
    extraPrices: toExtraPrices(row.extra_prices),
    priceNote: row.price_note,
    durationMinutes: row.duration_minutes,
    categoryId: row.category_id,
    image: row.image_url,
    tag: row.tag,
    active: row.active,
    sortOrder: row.sort_order,
    updatedAt: row.updated_at,
  }
}

export function toCategory(row: CategoryRow): Category {
  return { id: row.id, slug: row.slug, name: row.name, sortOrder: row.sort_order }
}
