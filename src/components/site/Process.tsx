'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { PROCESS } from '@/lib/site'
import { Reveal, SectionLabel } from './primitives'

export function Process() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 70%'] })
  const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="processo" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-5 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal><SectionLabel center>Como funciona</SectionLabel></Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] text-espresso">
              Uma jornada pensada nos{' '}
              <span className="italic text-gradient-gold">mínimos detalhes</span>.
            </h2>
          </Reveal>
        </div>

        <div ref={ref} style={{ position: 'relative' }} className="mt-16 pl-12 md:pl-0">
          {/* Trilha animada */}
          <div className="absolute bottom-0 left-[1.4rem] top-0 w-px bg-border md:left-1/2 md:-translate-x-1/2">
            <motion.div
              style={{ height }}
              className="absolute inset-x-0 top-0 w-px bg-gradient-to-b from-gold to-rose-gold"
            />
          </div>

          <div className="space-y-10 md:space-y-16">
            {PROCESS.map((p, i) => {
              const left = i % 2 === 0
              return (
                <Reveal key={p.step} delay={0.05}>
                  <div className={`relative md:flex md:items-center ${left ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <span className="absolute -left-[2.35rem] top-1 grid size-9 place-items-center rounded-full border border-border bg-card font-display text-sm text-gold shadow-sm md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
                      {p.step}
                    </span>
                    <div className="md:w-1/2" />
                    <div className={`md:w-1/2 ${left ? 'md:pl-12 md:text-left' : 'md:pr-12 md:text-right'}`}>
                      <div className="rounded-2xl border border-border bg-card p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(46,37,32,0.4)]">
                        <h3 className="font-display text-xl text-espresso">{p.title}</h3>
                        <p className="mt-2 leading-relaxed text-espresso/60">{p.text}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
