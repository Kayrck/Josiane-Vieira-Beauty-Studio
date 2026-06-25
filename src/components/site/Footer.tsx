'use client'

import { Instagram, MessageCircle, MapPin, Clock } from 'lucide-react'
import { BRAND, NAV_LINKS } from '@/lib/site'
import { waLink } from '@/lib/whatsapp'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Marca */}
          <div className="md:col-span-5">
            <p className="font-display text-3xl text-espresso">{BRAND.name}</p>
            <p className="tracking-luxe mt-1 text-[9px] uppercase text-gold">Beauty Studio</p>
            <p className="mt-5 max-w-xs leading-relaxed text-espresso/60">
              Especialista em extensão de cílios premium e design do olhar.
              Excelência não é um ato, mas um hábito.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={BRAND.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram @lashesbyjosiane"
                className="grid size-11 place-items-center rounded-full border border-espresso/15 text-espresso transition-colors hover:bg-espresso hover:text-primary-foreground"
              >
                <Instagram className="size-5" />
              </a>
              <a
                href={waLink('entrar-em-contato')}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="grid size-11 place-items-center rounded-full border border-espresso/15 text-espresso transition-colors hover:bg-espresso hover:text-primary-foreground"
              >
                <MessageCircle className="size-5" />
              </a>
            </div>
          </div>

          {/* Navegação */}
          <div className="md:col-span-3">
            <p className="tracking-luxe text-[10px] uppercase text-muted-foreground">Navegação</p>
            <ul className="mt-5 grid grid-cols-2 gap-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-espresso/70 transition-colors hover:text-gold">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div className="md:col-span-4">
            <p className="tracking-luxe text-[10px] uppercase text-muted-foreground">Contato & visita</p>
            <ul className="mt-5 space-y-4 text-espresso/70">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                <a
                  href={BRAND.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-espresso transition-colors"
                >
                  {BRAND.address}
                  <br />
                  {BRAND.city}
                  <br />
                  Brasil
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="size-4 shrink-0 text-gold" aria-hidden />
                {BRAND.hours}
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="size-4 shrink-0 text-gold" aria-hidden />
                <a
                  href={waLink('entrar-em-contato')}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-espresso transition-colors"
                >
                  {BRAND.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} {BRAND.full}. Todos os direitos reservados.</p>
          <p>Políticas de atendimento e reserva · {BRAND.instagramHandle}</p>
        </div>
      </div>
    </footer>
  )
}
