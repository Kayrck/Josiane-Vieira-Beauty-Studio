'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Pencil, Search, Plus } from 'lucide-react'
import { setProcedureActiveAction } from '@/app/admin/actions'
import { ProcedureImage } from '@/components/shared/ProcedureImage'
import { cn } from '@/components/ui/utils'
import { formatBRL, formatDuration } from '@/lib/catalog/format'
import type { Category, Procedure } from '@/lib/catalog/types'
import { NETWORK_ERROR, useFailureHandler } from './hooks'
import { buttonClass, cardClass, inputClass } from './styles'
import { StatsGrid } from './StatsGrid'
import { Button, ConfirmDialog, StatusBadge, useToast } from './ui'

type StatusFilter = 'all' | 'active' | 'inactive'

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function ProcedureList({
  procedures: serverProcedures,
  categories,
}: {
  procedures: Procedure[]
  categories: Category[]
}) {
  const toast = useToast()
  const handleFailure = useFailureHandler()

  const [status, setStatus] = useState<StatusFilter>('all')
  const [categoryId, setCategoryId] = useState<string>('all')
  const [query, setQuery] = useState('')
  const [confirm, setConfirm] = useState<{ procedure: Procedure; next: boolean } | null>(null)
  const [busy, setBusy] = useState(false)

  // Atualização otimista: assim que o servidor confirma, a lista já mostra o novo status,
  // sem esperar a releitura da página (que chega logo em seguida e substitui isto).
  const [overrides, setOverrides] = useState<Record<string, boolean>>({})
  useEffect(() => setOverrides({}), [serverProcedures])
  const procedures = useMemo(
    () => serverProcedures.map((p) => (p.id in overrides ? { ...p, active: overrides[p.id] } : p)),
    [serverProcedures, overrides],
  )

  const categoryName = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories])

  const counts = useMemo(() => {
    const active = procedures.filter((p) => p.active).length
    return { all: procedures.length, active, inactive: procedures.length - active }
  }, [procedures])

  const filtered = useMemo(() => {
    const q = normalize(query)
    return procedures.filter((p) => {
      if (status === 'active' && !p.active) return false
      if (status === 'inactive' && p.active) return false
      if (categoryId !== 'all' && p.categoryId !== categoryId) return false
      if (q && !normalize(`${p.name} ${p.description}`).includes(q)) return false
      return true
    })
  }, [procedures, status, categoryId, query])

  const hasFilters = status !== 'all' || categoryId !== 'all' || query.trim() !== ''

  async function confirmToggle() {
    if (!confirm) return
    setBusy(true)
    try {
      const result = await setProcedureActiveAction({ id: confirm.procedure.id, active: confirm.next })
      if (result.ok) {
        setOverrides((current) => ({ ...current, [confirm.procedure.id]: confirm.next }))
        toast.success(
          confirm.next
            ? `“${confirm.procedure.name}” foi reativado e já aparece no site.`
            : `“${confirm.procedure.name}” foi inativado e saiu do site.`,
        )
        setConfirm(null)
      } else {
        handleFailure(result)
        setConfirm(null)
      }
    } catch {
      toast.error(NETWORK_ERROR)
    } finally {
      setBusy(false)
    }
  }

  const tabs: { id: StatusFilter; label: string; count: number }[] = [
    { id: 'all', label: 'Todos', count: counts.all },
    { id: 'active', label: 'Ativos', count: counts.active },
    { id: 'inactive', label: 'Inativos', count: counts.inactive },
  ]

  if (procedures.length === 0) {
    return (
      <div className={cn(cardClass, 'p-8 text-center')}>
        <p className="font-display text-2xl text-espresso">Nenhum procedimento ainda</p>
        <p className="mx-auto mt-2 max-w-sm text-espresso/60">
          Cadastre o primeiro procedimento para ele aparecer no site.
        </p>
        <Link href="/admin/procedimentos/novo" className={buttonClass('primary', 'mt-6')}>
          <Plus className="size-4" aria-hidden /> Novo procedimento
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <StatsGrid total={counts.all} active={counts.active} inactive={counts.inactive} categories={categories.length} />

      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-espresso/45" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar procedimento"
            aria-label="Buscar procedimento"
            autoComplete="off"
            className={cn(inputClass, 'pl-11')}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div
            role="group"
            aria-label="Filtrar por situação"
            className="grid flex-1 grid-cols-3 gap-1 rounded-full bg-secondary p-1"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-pressed={status === tab.id}
                onClick={() => setStatus(tab.id)}
                className={cn(
                  'min-h-11 rounded-full px-2 text-sm transition-colors',
                  status === tab.id ? 'bg-white text-espresso shadow-sm' : 'text-espresso/60 hover:text-espresso',
                )}
              >
                {tab.label} <span className="text-xs text-espresso/45">{tab.count}</span>
              </button>
            ))}
          </div>

          {categories.length > 1 && (
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              aria-label="Filtrar por categoria"
              className={cn(inputClass, 'sm:w-60')}
            >
              <option value="all">Todas as categorias</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={cn(cardClass, 'mt-5 p-8 text-center')}>
          <p className="font-display text-xl text-espresso">Nada encontrado</p>
          <p className="mt-1 text-espresso/60">Nenhum procedimento corresponde aos filtros escolhidos.</p>
          {hasFilters && (
            <Button
              variant="outline"
              className="mt-5"
              onClick={() => {
                setStatus('all')
                setCategoryId('all')
                setQuery('')
              }}
            >
              Limpar filtros
            </Button>
          )}
        </div>
      ) : (
        <ul className="mt-5 grid gap-4 md:grid-cols-2">
          {filtered.map((p) => (
            <li key={p.id} className={cn(cardClass, 'flex flex-col overflow-hidden', !p.active && 'bg-secondary/60')}>
              <div className="flex gap-4 p-4">
                <div className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-xl bg-champagne-soft sm:w-24">
                  <ProcedureImage
                    src={p.image}
                    alt=""
                    sizes="96px"
                    className={cn('object-cover', !p.active && 'opacity-60 grayscale')}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-lg leading-snug text-espresso">{p.name}</h3>
                    <StatusBadge active={p.active} />
                  </div>
                  <p className="mt-0.5 text-xs text-espresso/55">
                    {categoryName.get(p.categoryId) ?? 'Sem categoria'} · {formatDuration(p.durationMinutes)}
                  </p>
                  <p className="mt-2 font-display text-[1.4rem] leading-none text-espresso">{formatBRL(p.price)}</p>
                  {(p.extraPrices.length > 0 || p.priceNote) && (
                    <p className="mt-2 text-xs leading-relaxed text-espresso/60">
                      {[...p.extraPrices.map((e) => `${e.label} ${formatBRL(e.amount)}`), ...(p.priceNote ? [p.priceNote] : [])].join(' · ')}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-auto grid grid-cols-2 gap-2 border-t border-border p-3">
                <Link href={`/admin/procedimentos/${p.id}`} className={buttonClass('outline', 'px-4')}>
                  <Pencil className="size-4" aria-hidden /> Editar
                </Link>
                <Button
                  variant={p.active ? 'soft' : 'primary'}
                  className="px-4"
                  onClick={() => setConfirm({ procedure: p, next: !p.active })}
                >
                  {p.active ? 'Inativar' : 'Reativar'}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={confirm !== null}
        busy={busy}
        title={confirm?.next ? 'Reativar procedimento?' : 'Inativar procedimento?'}
        description={
          confirm?.next ? (
            <>
              <strong className="font-medium text-espresso">“{confirm.procedure.name}”</strong> voltará a aparecer no
              site para todas as clientes.
            </>
          ) : (
            <>
              <strong className="font-medium text-espresso">“{confirm?.procedure.name}”</strong> deixará de aparecer no
              site, mas continua guardado. Você pode reativar quando quiser.
            </>
          )
        }
        confirmLabel={confirm?.next ? 'Sim, reativar' : 'Sim, inativar'}
        tone={confirm?.next ? 'default' : 'danger'}
        onConfirm={confirmToggle}
        onCancel={() => !busy && setConfirm(null)}
      />
    </div>
  )
}
