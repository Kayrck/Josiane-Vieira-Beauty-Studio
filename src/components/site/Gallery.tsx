'use client'

import { motion } from 'motion/react'
import { ImageWithFallback } from '@/components/shared/ImageWithFallback'
import { GALLERY } from '@/lib/site'
import { Reveal, SectionLabel } from './primitives'

const LAYOUT = [
  'col-span-6 row-span-2 lg:col-span-4 lg:row-span-2',
  'col-span-6 lg:col-span-4 -rotate-1',
  'col-span-6 lg:col-span-4 row-span-2 rotate-1',
  'col-span-6 lg:col-span-4',
  'col-span-6 lg:col-span-3 rotate-1',
  'col-span-6 lg:col-span-5 row-span-2 -rotate-1',
  'col-span-6 lg:col-span-4',
  'col-span-12 lg:col-span-3',
]

export function Gallery() {
  return (
    <section id="galeria" className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal><SectionLabel>Galeria</SectionLabel></Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] text-espresso">
                Olhares que contam{' '}
                <span className="italic text-gradient-gold">histórias</span>.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.16}>
            <p className="max-w-xs text-espresso/60">
              Uma curadoria de resultados reais, capturados em cada detalhe.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid auto-rows-[140px] grid-cols-12 gap-3 sm:auto-rows-[180px] sm:gap-4">
          {GALLERY.map((src, i) => (
            <motion.div
              key={src + i}
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.8, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.03, rotate: 0, zIndex: 20 }}
              className={`group relative overflow-hidden rounded-2xl bg-champagne-soft shadow-[0_20px_50px_-35px_rgba(46,37,32,0.5)] ${LAYOUT[i % LAYOUT.length]}`}
            >
              <ImageWithFallback
                src={src}
                alt={`Resultado de design do olhar ${i + 1}`}
                className="size-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
