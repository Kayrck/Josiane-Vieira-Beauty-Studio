'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { Reveal, SectionLabel, BookButton } from './primitives'

const LashCanvas = dynamic(
  () => import('./LashCanvas').then((m) => m.LashCanvas),
  { ssr: false }
)

export function Gallery() {
  const sectionRef = useRef<HTMLElement>(null)
  const [canvasReady, setCanvasReady] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCanvasReady(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="galeria" ref={sectionRef} className="relative overflow-hidden bg-espresso">
      {/* Hero 3D */}
      <div className="relative h-[88vh] min-h-[580px] flex items-center">
        {/* Canvas WebGL — montado só quando a seção entra no viewport */}
        <div className="absolute inset-0">
          {canvasReady && <LashCanvas />}
        </div>

        {/* Gradientes sobre o canvas */}
        <div className="pointer-events-none absolute inset-0 bg-espresso/60 md:hidden" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-espresso via-espresso/55 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso via-transparent to-espresso/55" />

        {/* Texto sobreposto */}
        <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-10 w-full">
          <div className="max-w-[530px]">
            <Reveal>
              <SectionLabel light>Galeria</SectionLabel>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,3.9rem)] leading-[1.05] text-white">
                Olhares que contam{' '}
                <span className="italic text-gradient-gold">histórias</span>.
              </h2>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-5 max-w-sm text-white/50 leading-relaxed text-[1.05rem]">
                Uma curadoria de resultados reais, capturados em cada detalhe.
              </p>
            </Reveal>
            <Reveal delay={0.28}>
              <div className="mt-9">
                <BookButton variant="light" message="agendar-agora">
                  Quero agendar
                </BookButton>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

    </section>
  )
}
