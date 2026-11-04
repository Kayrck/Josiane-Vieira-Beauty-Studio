// Cliente anônimo, SEM cookies, para ler o catálogo público.
// Como não depende da requisição, a página inicial continua estática (ISR) e rápida.
// O que ele enxerga é decidido pelas policies de RLS: somente procedimentos ativos.

import { createClient } from '@supabase/supabase-js'
import { requireSupabaseEnv } from './env'
import { NO_REALTIME } from './options'

export function createSupabasePublicClient() {
  const { url, key } = requireSupabaseEnv()
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    realtime: NO_REALTIME,
  })
}
