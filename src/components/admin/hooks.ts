'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ActionFailure } from '@/lib/action-result'
import { useToast } from './ui'

/**
 * true somente depois que o JavaScript da página carregou (hidratação).
 * Em conexões lentas de celular isso pode levar alguns segundos: até lá os campos ficam
 * travados, para não perder o que foi digitado nem enviar o formulário "na forma antiga"
 * (que recarregaria a página, e no login colocaria a senha na URL).
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}

/**
 * Trata as falhas das Server Actions de forma única:
 * sessão expirada → volta ao login; demais erros → aviso claro.
 * Devolve true se a falha foi de acesso (a tela já está sendo trocada).
 */
export function useFailureHandler() {
  const router = useRouter()
  const toast = useToast()

  return useCallback(
    (failure: ActionFailure): boolean => {
      if (failure.code === 'unauthorized' || failure.code === 'forbidden') {
        toast.error(failure.error)
        router.replace('/admin/login')
        router.refresh()
        return true
      }
      toast.error(failure.error)
      return false
    },
    [router, toast],
  )
}

export const NETWORK_ERROR =
  'Não foi possível concluir. Verifique sua conexão com a internet e tente novamente.'
