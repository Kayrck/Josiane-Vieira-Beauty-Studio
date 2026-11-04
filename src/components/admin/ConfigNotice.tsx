import { cardClass } from './styles'
import { cn } from '@/components/ui/utils'

/** Aviso exibido quando as variáveis do Supabase ainda não foram definidas (sem expor segredos). */
export function ConfigNotice() {
  return (
    <div className={cn(cardClass, 'mt-8 p-6 sm:p-8')}>
      <h1 className="font-display text-2xl text-espresso">Painel ainda não configurado</h1>
      <p className="mt-2 text-sm leading-relaxed text-espresso/70">
        Para ativar o painel, defina estas variáveis de ambiente (no arquivo <code>.env.local</code> e na Vercel) e
        faça um novo deploy:
      </p>
      <ul className="mt-4 space-y-2 rounded-xl bg-secondary p-4 font-mono text-[13px] text-espresso">
        <li>NEXT_PUBLIC_SUPABASE_URL</li>
        <li>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</li>
      </ul>
      <p className="mt-4 text-sm leading-relaxed text-espresso/70">
        O passo a passo completo está em <code>docs/ADMIN-SETUP.md</code>. Enquanto isso, o site público continua no ar
        normalmente.
      </p>
    </div>
  )
}
