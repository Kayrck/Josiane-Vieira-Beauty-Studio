// Estilos compartilhados do painel (sem 'use client': podem ser usados em Server Components).
// Mesma linguagem visual do site: bege/espresso/dourado, cantos bem arredondados e
// alvos de toque de pelo menos 44 px.

import { cn } from '@/components/ui/utils'

export type ButtonVariant = 'primary' | 'outline' | 'soft' | 'danger' | 'ghost'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:shadow-[0_14px_40px_-14px_rgba(46,37,32,0.55)]',
  outline: 'border border-espresso/25 text-espresso hover:border-espresso hover:bg-espresso hover:text-primary-foreground',
  soft: 'bg-secondary text-espresso hover:bg-champagne',
  danger: 'bg-destructive text-destructive-foreground hover:brightness-95',
  ghost: 'text-espresso/70 hover:bg-secondary',
}

export function buttonClass(variant: ButtonVariant = 'primary', extra?: string) {
  return cn(
    'inline-flex min-h-11 select-none items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 text-[0.95rem] transition-all duration-300',
    'focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-55',
    VARIANTS[variant],
    extra,
  )
}

/** Campos: 16px (evita o zoom automático do iPhone) e altura confortável para o dedo. */
export const inputClass = cn(
  'block min-h-12 w-full rounded-xl border border-espresso/15 bg-white px-4 text-base text-espresso',
  'placeholder:text-espresso/35 transition-colors focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/15',
  'disabled:opacity-60 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-4 aria-[invalid=true]:ring-destructive/10',
)

export const cardClass =
  'rounded-[1.4rem] border border-border bg-card shadow-[0_20px_50px_-40px_rgba(46,37,32,0.45)]'
