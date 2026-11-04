'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Clock, ArrowUpRight } from 'lucide-react'
import { ProcedureImage } from '@/components/shared/ProcedureImage'
import { formatBRL, formatDuration } from '@/lib/catalog/format'
import type { Category, Procedure } from '@/lib/catalog/types'
import { procedureWaLink } from '@/lib/whatsapp'
import { BookButton, Reveal, SectionLabel } from './primitives'

const CARD_IMAGE_SIZES = '(min-width: 1280px) 295px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw'

export function Procedures({
  procedures,
  categories,
}: {
  procedures: Procedure[]
  categories: Category[]
}) {
  const [selected, setSelected] = useState<string>('all')

  const showFilters = categories.length > 1
  const visible =
    selected === 'all' ? procedures : procedures.filter((p) => p.categoryId === selected)

  return (
    <section id="procedimentos" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Reveal><SectionLabel>Procedimentos</SectionLabel></Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] text-espresso">
                A técnica certa para o{' '}
                <span className="italic text-gradient-gold">seu olhar</span>.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.18}>
            <p className="max-w-xs text-espresso/60">
              Cada serviço é pensado para realçar a sua naturalidade com conforto e durabilidade.
            </p>
          </Reveal>
        </div>

        {showFilters && (
          <div
            role="group"
            aria-label="Filtrar procedimentos por categoria"
            className="mt-10 flex flex-wrap gap-2"
          >
            <FilterChip active={selected === 'all'} onClick={() => setSelected('all')}>
              Todos
            </FilterChip>
            {categories.map((c) => (
              <FilterChip key={c.id} active={selected === c.id} onClick={() => setSelected(c.id)}>
                {c.name}
              </FilterChip>
            ))}
          </div>
        )}

        {procedures.length === 0 ? (
          <div className="mt-14 rounded-[1.4rem] border border-border bg-card p-8 text-center md:p-12">
            <p className="font-display text-2xl text-espresso">Novidades a caminho</p>
            <p className="mx-auto mt-3 max-w-md text-espresso/60">
              Estamos atualizando nossos procedimentos. Chame a Josiane no WhatsApp para conhecer as
              opções e valores.
            </p>
            <div className="mt-7 flex justify-center">
              <BookButton message="entrar-em-contato">Falar no WhatsApp</BookButton>
            </div>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 ${showFilters ? 'mt-8' : 'mt-14'}`}
          >
            {visible.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 0.08}>
                <ProcedureCard procedure={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ProcedureCard({ procedure: p }: { procedure: Procedure }) {
  // Valores com finalidade própria (manutenção, variações) + observação curta
  const chips = [
    ...p.extraPrices.map((e) => `${e.label} ${formatBRL(e.amount)}`),
    ...(p.priceNote ? [p.priceNote] : []),
  ]

  return (
    <motion.a
      href={procedureWaLink(p.slug, p.name)}
      target="_blank"
      rel="noreferrer"
      aria-label={`Agendar ${p.name} pelo WhatsApp`}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="group flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-border bg-card shadow-[0_20px_50px_-35px_rgba(46,37,32,0.5)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-champagne-soft">
        <ProcedureImage
          src={p.image}
          alt={`Resultado do procedimento ${p.name}`}
          sizes={CARD_IMAGE_SIZES}
          className="object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent opacity-70" />
        {p.tag && (
          <span className="glass absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] tracking-wide text-espresso">
            {p.tag}
          </span>
        )}
        <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-espresso opacity-0 transition-all duration-500 group-hover:opacity-100" aria-hidden>
          <ArrowUpRight className="size-4" />
        </span>
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 p-3 text-[11px] text-white/90">
          <Clock className="size-3.5" />
          {formatDuration(p.durationMinutes)}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl text-espresso">{p.name}</h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-espresso/60">{p.description}</p>
        {chips.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <p
                key={chip}
                className="inline-flex w-fit rounded-full bg-secondary px-3 py-1 text-[11px] text-espresso/70"
              >
                {chip}
              </p>
            ))}
          </div>
        )}
        <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
          <span className="font-display text-[1.5rem] leading-none text-espresso">{formatBRL(p.price)}</span>
          <span className="text-sm text-gold transition-colors group-hover:text-espresso">
            Agendar →
          </span>
        </div>
      </div>
    </motion.a>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-11 rounded-full border px-5 text-sm transition-colors ${
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-espresso/15 text-espresso/70 hover:bg-secondary'
      }`}
    >
      {children}
    </button>
  )
}
