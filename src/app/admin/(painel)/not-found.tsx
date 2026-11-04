import Link from 'next/link'
import { buttonClass, cardClass } from '@/components/admin/styles'
import { cn } from '@/components/ui/utils'

export default function PanelNotFound() {
  return (
    <div className={cn(cardClass, 'mx-auto max-w-md p-8 text-center')}>
      <h1 className="font-display text-2xl text-espresso">Procedimento não encontrado</h1>
      <p className="mt-2 text-espresso/60">Ele pode ter sido removido ou o endereço está incorreto.</p>
      <Link href="/admin" className={buttonClass('primary', 'mt-6')}>
        Voltar para a lista
      </Link>
    </div>
  )
}
