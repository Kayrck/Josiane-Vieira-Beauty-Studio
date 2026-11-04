import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ConfigNotice } from '@/components/admin/ConfigNotice'
import { LoginForm, SwitchAccount } from '@/components/admin/LoginForm'
import { cardClass } from '@/components/admin/styles'
import { cn } from '@/components/ui/utils'
import { getAdminSession } from '@/lib/auth'

export const metadata: Metadata = { title: 'Entrar' }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>
}) {
  const { erro } = await searchParams
  const session = await getAdminSession()

  // Quem já é administradora vai direto ao painel.
  if (session.status === 'ok') redirect('/admin')

  return (
    <main className="relative grid min-h-[100svh] place-items-center overflow-hidden px-4 py-10">
      <div aria-hidden className="glow-champagne pointer-events-none absolute -left-24 -top-24 size-[26rem] rounded-full opacity-70" />
      <div aria-hidden className="glow-rose pointer-events-none absolute -bottom-32 -right-24 size-[24rem] rounded-full opacity-40" />

      <div className="relative w-full max-w-md">
        <div className="text-center">
          <p className="font-display text-[2.2rem] leading-none text-espresso">Josiane Vieira</p>
          <p className="tracking-luxe mt-2 text-[9px] uppercase text-gold">Beauty Studio · Painel</p>
        </div>

        {session.status === 'not-configured' ? (
          <ConfigNotice />
        ) : (
          <div className={cn(cardClass, 'mt-8 p-6 sm:p-8')}>
            <h1 className="font-display text-2xl text-espresso">Entrar</h1>
            <p className="mt-1 text-sm text-espresso/60">Acesso restrito à equipe do estúdio.</p>

            {session.status === 'forbidden' ? (
              <SwitchAccount email={session.email} />
            ) : (
              <LoginForm
                notice={
                  session.status === 'error'
                    ? session.message
                    : erro === 'sem-permissao'
                      ? 'Esta conta não tem permissão para acessar o painel.'
                      : undefined
                }
              />
            )}
          </div>
        )}

        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-espresso/60 transition-colors hover:text-espresso">
            ← Voltar ao site
          </Link>
        </p>
      </div>
    </main>
  )
}
