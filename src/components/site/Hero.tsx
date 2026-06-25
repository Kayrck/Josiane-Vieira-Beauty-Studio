'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Star, Sparkles } from 'lucide-react'
import { ImageWithFallback } from '@/components/shared/ImageWithFallback'
import { BRAND, IMAGES } from '@/lib/site'
import { BookButton, Orb } from './primitives'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yImg  = useTransform(scrollYProgress, [0, 1], [0, 120])
  const yText = useTransform(scrollYProgress, [0, 1], [0, -60])
  const fade  = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section
      id="inicio"
      ref={ref}
      style={{ position: 'relative' }}
      className="min-h-[100svh] overflow-hidden bg-[#f7f0e7] pb-28 pt-28 md:pt-32 lg:pb-0"
    >
      <Orb className="left-[-10%] top-[-5%] size-[40rem] opacity-70" />
      <Orb className="bottom-[-15%] right-[-10%] size-[34rem]" variant="rose" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 md:px-10 lg:min-h-[calc(100svh-8rem)] lg:grid-cols-12">
        {/* Texto */}
        <motion.div style={{ y: yText, opacity: fade }} className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3"
          >
            <span className="h-px w-8 bg-gold/60" />
            <span className="tracking-luxe text-[11px] uppercase text-gold">{BRAND.tagline}</span>
          </motion.div>

          <h1 className="mt-6 font-display text-[clamp(2.8rem,9vw,5.5rem)] leading-[0.98] tracking-[-0.01em] text-espresso">
            <RevealWord delay={0.15}>Realce</RevealWord>{' '}
            <RevealWord delay={0.28}>o seu</RevealWord>{' '}
            <span className="italic text-gradient-gold">
              <RevealWord delay={0.42}>olhar.</RevealWord>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 max-w-md text-lg leading-relaxed text-espresso/70"
          >
            Descubra a técnica perfeita para valorizar sua beleza natural, uma experiência de cuidado, delicadeza e excelência.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <BookButton message="agendar-agora">Agendar agora</BookButton>
            <a
              href="#procedimentos"
              className="inline-flex items-center gap-2 rounded-full border border-espresso/20 px-7 py-3.5 text-espresso transition-colors hover:bg-espresso hover:text-primary-foreground"
            >
              Conheça os procedimentos
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-10 flex items-center gap-6"
          >
            <div className="flex items-center gap-1.5" aria-label="5 estrelas">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-gold text-gold" />
              ))}
            </div>
            <p className="text-sm text-espresso/60">
              <span className="text-espresso">+1000 atendimentos</span> · clientes apaixonadas
            </p>
          </motion.div>
        </motion.div>

        {/* Imagens */}
        <div className="relative lg:col-span-6">
          <motion.div
            style={{ y: yImg }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto aspect-[4/5] w-full max-w-[26rem] overflow-hidden rounded-[2rem] bg-champagne-soft shadow-[0_40px_90px_-30px_rgba(46,37,32,0.5)]"
          >
            <ImageWithFallback
              src={IMAGES.heroPortrait}
              alt="Josiane Vieira, profissional especialista em design do olhar"
              className="size-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/25 via-transparent to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="animate-floaty absolute -left-2 top-10 hidden w-40 overflow-hidden rounded-2xl border-4 border-white shadow-2xl sm:block lg:-left-6"
          >
            <ImageWithFallback
              src={IMAGES.heroEye}
              alt="Detalhe de cílios aplicados"
              className="aspect-square w-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.85 }}
            className="animate-floaty-slow glass absolute -bottom-4 right-0 w-52 rounded-2xl p-4 shadow-xl lg:right-[-1rem]"
          >
            <div className="flex items-center gap-2 text-gold">
              <Sparkles className="size-4" />
              <span className="tracking-luxe text-[9px] uppercase">Cílios PRO</span>
            </div>
            <p className="mt-2 font-display text-[1.6rem] leading-none text-espresso">Excelência</p>
            <p className="mt-1 text-xs text-espresso/60">não é um ato, mas um hábito.</p>
          </motion.div>
        </div>
      </div>

      <motion.div
        style={{ opacity: fade }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
        aria-hidden
      >
        <span className="tracking-luxe text-[9px] uppercase text-espresso/50">Role para descobrir</span>
        <span className="relative h-10 w-px overflow-hidden bg-espresso/20">
          <motion.span
            animate={{ y: [-40, 40] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="absolute inset-x-0 top-0 h-4 bg-gold"
          />
        </span>
      </motion.div>
    </section>
  )
}

function RevealWord({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="inline-block overflow-hidden align-bottom">
      <motion.span
        initial={{ y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  )
}
