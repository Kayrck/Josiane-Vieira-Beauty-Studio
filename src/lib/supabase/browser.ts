'use client'

// Cliente do Supabase no navegador. Usado apenas para enviar fotos ao Storage com a
// sessão da administradora (as policies do bucket exigem is_admin()).

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseEnv } from './env'
import { NO_REALTIME } from './options'

let client: SupabaseClient | null = null

export function getSupabaseBrowserClient(): SupabaseClient {
  if (client) return client
  const env = getSupabaseEnv()
  if (!env) throw new Error('Supabase não configurado.')
  client = createBrowserClient(env.url, env.key, { realtime: NO_REALTIME })
  return client
}
