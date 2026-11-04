'use client'

import { useEffect } from 'react'
import { Button } from '@/components/admin/ui'
import { cardClass } from '@/components/admin/styles'
import { cn } from '@/components/ui/utils'

export default function PanelError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[painel]', error)
  }, [error])

  return (
    <div className={cn(cardClass, 'mx-auto max-w-md p-8 text-center')}>
      <h1 className="font-display text-2xl text-espresso">Algo não saiu como esperado</h1>
      <p className="mt-2 text-espresso/60">
        Não foi possível carregar esta tela. Verifique sua conexão com a internet e tente novamente.
      </p>
      <Button className="mt-6" onClick={reset}>
        Tentar de novo
      </Button>
    </div>
  )
}
