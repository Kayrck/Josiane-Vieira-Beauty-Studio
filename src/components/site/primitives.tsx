'use client'

import { motion, useInView } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { waLink } from '@/lib/whatsapp'

/* ── Reveal ── fade + rise ao entrar na viewport ── */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className = '',
  once = true,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  once?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, margin: '-8% 0px -8% 0px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ── SectionLabel ── eyebrow com traços laterais ── */
export function SectionLabel({
  children,
  center = false,
  light = false,
}: {
  children: ReactNode
  center?: boolean
  light?: boolean
}) {
  return (
    <div className={`flex items-center gap-3 ${center ? 'justify-center' : ''}`}>
      <span className={`h-px w-8 ${light ? 'bg-white/40' : 'bg-gold/50'}`} aria-hidden />
      <span className={`tracking-luxe uppercase text-[11px] ${light ? 'text-white/70' : 'text-gold'}`}>
        {children}
      </span>
      {center && <span className={`h-px w-8 ${light ? 'bg-white/40' : 'bg-gold/50'}`} aria-hidden />}
    </div>
  )
}

/* ── BookButton ── botão principal de agendamento via WhatsApp ── */
export function BookButton({
  children = 'Agendar agora',
  message,
  className = '',
  variant = 'solid',
}: {
  children?: ReactNode
  message?: string
  className?: string
  variant?: 'solid' | 'outline' | 'light'
}) {
  const base =
    'group relative inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 overflow-hidden transition-all duration-500 will-change-transform'
  const styles =
    variant === 'solid'
      ? 'bg-primary text-primary-foreground hover:shadow-[0_18px_50px_-12px_rgba(46,37,32,0.55)]'
      : variant === 'light'
      ? 'bg-white text-espresso hover:shadow-[0_18px_50px_-12px_rgba(255,255,255,0.5)]'
      : 'border border-espresso/25 text-espresso hover:border-espresso/60 hover:bg-espresso hover:text-primary-foreground'

  return (
    <motion.a
      href={waLink(message)}
      target="_blank"
      rel="noreferrer"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${styles} ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <ArrowRight className="relative z-10 size-4 transition-transform duration-500 group-hover:translate-x-1" />
      {variant === 'solid' && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      )}
    </motion.a>
  )
}

/* ── Orb ── brilho ambiente decorativo ── */
export function Orb({
  className = '',
  variant = 'champagne',
}: {
  className?: string
  variant?: 'champagne' | 'rose'
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-3xl ${
        variant === 'champagne' ? 'glow-champagne' : 'glow-rose'
      } ${className}`}
    />
  )
}
