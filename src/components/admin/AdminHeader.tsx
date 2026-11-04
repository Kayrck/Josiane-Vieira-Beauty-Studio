'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ExternalLink, Loader2, LogOut } from 'lucide-react'
import { signOutAction } from '@/app/admin/actions'
import { cn } from '@/components/ui/utils'

const NAV = [
  { href: '/admin', label: 'Procedimentos', match: (p: string) => p === '/admin' || p.startsWith('/admin/procedimentos') },
  { href: '/admin/categorias', label: 'Categorias', match: (p: string) => p.startsWith('/admin/categorias') },
]

const iconButton =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-espresso/15 px-3.5 text-sm text-espresso transition-colors hover:bg-espresso hover:text-primary-foreground sm:px-4'

export function AdminHeader({ email }: { email: string }) {
  const pathname = usePathname()
  const [leaving, setLeaving] = useState(false)

  async function signOut() {
    setLeaving(true)
    try {
      await signOutAction() // encerra a sessão e redireciona para o login
    } catch {
      setLeaving(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/admin" className="flex min-h-11 flex-col justify-center leading-none">
          <span className="font-display text-[1.3rem] tracking-tight text-espresso">Josiane Vieira</span>
          <span className="tracking-luxe mt-1 text-[8px] uppercase text-gold">Painel do estúdio</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="mr-1 hidden max-w-48 truncate text-xs text-espresso/50 lg:inline" title={email}>
            {email}
          </span>
          <a href="/" target="_blank" rel="noreferrer" className={iconButton} aria-label="Ver o site (abre em outra aba)">
            <ExternalLink className="size-4" aria-hidden />
            <span className="hidden sm:inline">Ver site</span>
          </a>
          <button type="button" onClick={signOut} disabled={leaving} className={iconButton} aria-label="Sair do painel">
            {leaving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <LogOut className="size-4" aria-hidden />}
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>

      <nav aria-label="Seções do painel" className="mx-auto flex max-w-5xl gap-2 px-4 pb-3 sm:px-6">
        {NAV.map((item) => {
          const active = item.match(pathname)
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'inline-flex min-h-11 items-center rounded-full px-5 text-sm transition-colors',
                active ? 'bg-primary text-primary-foreground' : 'text-espresso/70 hover:bg-secondary',
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
