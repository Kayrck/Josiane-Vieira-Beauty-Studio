import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return updateSession(request)
}

// Roda somente na área administrativa: o site público continua 100% estático e rápido.
// Runtime Node.js: o supabase-js usa APIs de Node (process.version) que o runtime Edge
// sinaliza como aviso a cada build. Como o painel é de uso interno, o tempo extra de
// inicialização é irrelevante.
export const config = {
  runtime: 'nodejs',
  matcher: ['/admin/:path*'],
}
