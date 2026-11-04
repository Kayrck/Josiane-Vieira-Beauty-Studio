// Renovação da sessão + primeira barreira de acesso à área /admin.
//
// ATENÇÃO: isto NÃO é a segurança do painel. Ele só evita telas vazias e renova
// os cookies de login. A autorização real acontece (1) em cada página e em cada
// Server Action via requireAdmin()/adminGuard() e (2) no banco, com RLS.

import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getSupabaseEnv } from './env'
import { NO_REALTIME } from './options'

export async function updateSession(request: NextRequest) {
  const env = getSupabaseEnv()
  // Sem Supabase configurado a página de login mostra o aviso de configuração.
  if (!env) return NextResponse.next({ request })

  let response = NextResponse.next({ request })

  const supabase = createServerClient(env.url, env.key, {
    realtime: NO_REALTIME,
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value)
        response = NextResponse.next({ request })
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options)
        }
        // Respostas que gravam cookies de sessão nunca podem ser cacheadas.
        for (const [key, value] of Object.entries(headers ?? {})) response.headers.set(key, value)
      },
    },
  })

  // getUser() valida o token junto ao servidor de autenticação (getSession() não valida).
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isLogin = pathname === '/admin/login' || pathname.startsWith('/admin/login/')

  if (!user && !isLogin) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.search = ''
    const redirect = NextResponse.redirect(url)
    // preserva cookies que o Supabase tenha limpado/renovado
    for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie)
    return redirect
  }

  return response
}
