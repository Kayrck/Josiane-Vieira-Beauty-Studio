'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { BRAND, NAV_LINKS } from '@/lib/site'
import { waLink } from '@/lib/whatsapp'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass shadow-[0_8px_30px_-18px_rgba(46,37,32,0.3)]' : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
          <a href="#inicio" className="flex flex-col leading-none">
            <span className="font-display text-[1.35rem] tracking-tight text-espresso">{BRAND.name}</span>
            <span className="tracking-luxe text-[8px] uppercase text-gold">Beauty Studio</span>
          </a>

          <ul className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="group relative text-sm text-espresso/70 transition-colors hover:text-espresso">
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href={waLink('agendar-agora')}
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-full bg-primary px-6 py-2.5 text-sm text-primary-foreground transition-all duration-500 hover:shadow-[0_14px_40px_-12px_rgba(46,37,32,0.55)] sm:inline-flex"
            >
              Agendar agora
            </a>
            <button
              onClick={() => setOpen(true)}
              aria-label="Abrir menu"
              className="grid size-11 place-items-center rounded-full border border-espresso/15 text-espresso transition-colors hover:bg-espresso hover:text-primary-foreground lg:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-[#f6efe6]"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
          >
            <div aria-hidden className="glow-champagne pointer-events-none absolute -right-20 top-10 size-72 rounded-full blur-3xl" />
            <div className="flex items-center justify-between px-5 py-4 md:px-10">
              <span className="font-display text-[1.35rem] text-espresso">{BRAND.name}</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
                className="grid size-11 place-items-center rounded-full border border-espresso/15 text-espresso transition-colors hover:bg-espresso hover:text-primary-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <nav className="relative mt-6 flex flex-col px-6 md:px-10">
              {NAV_LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i + 0.1, duration: 0.5 }}
                  className="group flex items-baseline justify-between border-b border-espresso/10 py-4"
                >
                  <span className="font-display text-[2rem] text-espresso transition-colors group-hover:text-gold">
                    {l.label}
                  </span>
                  <span className="tracking-luxe text-[10px] text-gold/60">0{i + 1}</span>
                </motion.a>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="px-6 pt-8 md:px-10"
            >
              <a
                href={waLink('agendar-agora')}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center rounded-full bg-primary px-6 py-4 text-primary-foreground"
              >
                Agendar meu horário
              </a>
              <p className="mt-5 text-center text-sm text-muted-foreground">
                {BRAND.instagramHandle} · {BRAND.phone}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
