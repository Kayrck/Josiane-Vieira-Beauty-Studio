'use client'

import { motion } from 'motion/react'
import { ImageWithFallback } from '@/components/shared/ImageWithFallback'
import { IMAGES } from '@/lib/site'
import { BookButton } from './primitives'

export function FinalCta() {
  return (
    <section id="contato" className="relative px-4 py-16 md:px-10 md:py-24">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-espresso md:rounded-[2.5rem]">
        <ImageWithFallback
          src={IMAGES.ctaBg}
          alt="Atmosfera do estúdio de beleza"
          className="absolute inset-0 size-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/70 to-espresso/40" />
        <div aria-hidden className="glow-rose pointer-events-none absolute -right-20 top-0 size-80 rounded-full opacity-50 blur-3xl" />

        <div className="relative px-6 py-20 text-center md:px-10 md:py-28">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="tracking-luxe text-[11px] uppercase text-champagne"
          >
            Seu olhar merece o melhor
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="mx-auto mt-5 max-w-3xl font-display text-[clamp(2.4rem,7vw,4.5rem)] leading-[1.02] text-white"
          >
            Vamos transformar a sua{' '}
            <span className="italic text-gradient-gold">autoestima</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-6 max-w-xl text-lg text-white/70"
          >
            Reserve o seu horário e viva uma experiência de beleza pensada em cada detalhe —
            do acolhimento ao resultado final.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 flex justify-center"
          >
            <BookButton variant="light" message="agendar-agora">
              Agendar atendimento
            </BookButton>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
