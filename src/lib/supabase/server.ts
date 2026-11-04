// Cliente do Supabase com a sessão da pessoa logada (cookies).
// Use em Server Components e Server Actions. Todas as consultas feitas por ele
// passam pelas policies de RLS com a identidade real do usuário.

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { requireSupabaseEnv } from './env'
import { NO_REALTIME } from './options'

export async function createSupabaseServerClient() {
  const { url, key } = requireSupabaseEnv()
  const cookieStore = await cookies()

  return createServerClient(url, key, {
    realtime: NO_REALTIME,
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        } catch {
          // Chamado durante a renderização de um Server Component (cookies são somente
          // leitura ali). Sem problema: o middleware renova a sessão a cada requisição.
        }
      },
    },
  })
}
