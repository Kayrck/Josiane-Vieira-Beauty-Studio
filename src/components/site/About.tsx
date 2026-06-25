'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { ImageWithFallback } from '@/components/shared/ImageWithFallback'
import { IMAGES, STATS } from '@/lib/site'
import { Reveal, SectionLabel, BookButton, Orb } from './primitives'

export function About() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <section
      id="sobre"
      ref={ref}
      style={{ position: 'relative' }}
      className="overflow-hidden py-24 md:py-32"
    >
      <Orb className="right-[-12%] top-1/4 size-[30rem] opacity-60" variant="rose" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 md:px-10 lg:grid-cols-2 lg:gap-20">
        {/* Imagem */}
        <div className="relative order-1">
          <Reveal>
            <div className="relative aspect-[4/5] w-full max-w-[28rem] overflow-hidden rounded-[2rem] bg-champagne-soft shadow-[0_40px_90px_-30px_rgba(46,37,32,0.45)]">
              <motion.div style={{ y }} className="absolute inset-0 -top-16 bottom-[-4rem]">
                <ImageWithFallback
                  src={IMAGES.about}
                  alt="Josiane Vieira, especialista em design do olhar"
                  className="size-full object-cover"
                />
              </motion.div>
            </div>
          </Reveal>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass animate-floaty absolute -bottom-6 -right-2 rounded-2xl px-6 py-5 text-center shadow-xl lg:-right-8"
          >
            <p className="font-display text-[2.2rem] leading-none text-gradient-gold">+1000</p>
            <p className="mt-1 tracking-luxe text-[9px] uppercase text-espresso/60">olhares transformados</p>
          </motion.div>
        </div>

        {/* Conteúdo */}
        <div className="order-2">
          <Reveal><SectionLabel>Quem é Josiane</SectionLabel></Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] text-espresso">
              Uma artista apaixonada pela{' '}
              <span className="italic text-gradient-gold">beleza do olhar</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-espresso/70">
              Há um ano transformando autoestimas, Josiane uniu técnica, sensibilidade e um olhar
              refinado para criar resultados que valorizam a beleza única de cada cliente.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <p className="mt-4 max-w-lg leading-relaxed text-espresso/60">
              Especialista PRO em extensão de cílios, ela acredita que cada detalhe faz a diferença, desde o acolhimento até o resultado final. O cuidado começa muito antes da aplicação do primeiro fio.
            </p>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={0.1 + i * 0.08}>
                <div className="h-full bg-card p-5 text-center">
                  <p className="font-display text-[1.7rem] leading-none text-espresso">{s.value}</p>
                  <p className="mt-2 text-[11px] leading-tight text-muted-foreground">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-10">
              <BookButton variant="outline" message="agendar-agora">
                Quero agendar com a Josiane
              </BookButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
