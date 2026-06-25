'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { FAQ } from '@/lib/site'
import { waLink } from '@/lib/whatsapp'
import { Reveal, SectionLabel } from './primitives'

export function Faq() {
  return (
    <section id="faq" className="relative bg-secondary/60 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 md:px-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal><SectionLabel>Dúvidas frequentes</SectionLabel></Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.2rem)] leading-[1.06] text-espresso">
              Tudo o que você precisa{' '}
              <span className="italic text-gradient-gold">saber</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-6 max-w-sm text-espresso/60">
              Precisa de mais informações? Converse com a Josiane pelo WhatsApp e tire todas as suas dúvidas.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <a
              href={waLink('duvida')}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex rounded-full border border-espresso/20 px-6 py-3 text-espresso transition-colors hover:bg-espresso hover:text-primary-foreground"
            >
              Tirar minha dúvida
            </a>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal delay={0.12}>
            <Accordion
              type="single"
              collapsible
              defaultValue="item-0"
              className="rounded-[1.4rem] border border-border bg-card px-6 md:px-8"
            >
              {FAQ.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`} className="border-border">
                  <AccordionTrigger className="py-6 text-left font-display text-lg text-espresso no-underline hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-base leading-relaxed text-espresso/65">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
