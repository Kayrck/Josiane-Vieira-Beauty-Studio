// Autenticação e AUTORIZAÇÃO do painel (somente servidor).
//
// Regra de ouro: a URL /admin não é segurança. Toda página e toda Server Action do painel
// chama requireAdmin()/getAdminSession(), que:
//   1. valida o token de login junto ao Supabase Auth (getUser) — não confia em cookie solto;
//   2. confere se o usuário está na tabela `admins` (função is_admin() do banco).
// E, por baixo disso, o banco ainda aplica RLS: mesmo que este código tivesse uma falha,
// quem não é administradora não consegue escrever nada.

import { cache } from 'react'
import { redirect, unstable_rethrow } from 'next/navigation'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export type AdminSession =
  | { status: 'ok'; supabase: SupabaseClient; user: User }
  | { status: 'not-configured' }
  | { status: 'unauthenticated' }
  | { status: 'forbidden'; email: string | null }
  | { status: 'error'; message: string }

/** Memorizado por requisição: layout + página + dados não repetem as chamadas ao Supabase. */
export const getAdminSession = cache(async (): Promise<AdminSession> => {
  if (!isSupabaseConfigured()) return { status: 'not-configured' }

  try {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data.user) return { status: 'unauthenticated' }

    const { data: isAdmin, error: rpcError } = await supabase.rpc('is_admin')
    if (rpcError) {
      console.error('[auth] falha ao verificar permissão de administrador:', rpcError.message)
      return { status: 'error', message: 'Não foi possível verificar seu acesso. Tente novamente.' }
    }
    if (isAdmin !== true) return { status: 'forbidden', email: data.user.email ?? null }

    return { status: 'ok', supabase, user: data.user }
  } catch (err) {
    // Sinais internos do Next (ex.: "esta rota é dinâmica") não são falhas: precisam subir.
    unstable_rethrow(err)
    console.error('[auth] erro inesperado:', err)
    return { status: 'error', message: 'Não foi possível verificar seu acesso. Tente novamente.' }
  }
})

/** Para páginas e Server Components: redireciona quem não tem acesso. */
export async function requireAdmin(): Promise<Extract<AdminSession, { status: 'ok' }>> {
  const session = await getAdminSession()
  switch (session.status) {
    case 'ok':
      return session
    case 'forbidden':
      redirect('/admin/login?erro=sem-permissao')
    case 'error':
      throw new Error(session.message)
    default:
      redirect('/admin/login')
  }
}
