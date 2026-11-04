// Variáveis de ambiente do Supabase.
//
// As duas variáveis abaixo são PÚBLICAS por desenho (URL do projeto + chave
// "publishable"/"anon"): a segurança vem das policies de RLS no banco, não do
// sigilo dessa chave. A chave secreta (service_role) NUNCA é usada nem lida
// por este projeto.
//
// Atenção: o Next.js só embute no bundle do navegador as referências LITERAIS
// a process.env.NEXT_PUBLIC_*, por isso não use acesso dinâmico aqui.

export type SupabaseEnv = {
  /** URL do projeto, sem barra final. */
  url: string
  key: string
}

export function getSupabaseEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return { url: url.replace(/\/+$/, ''), key }
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv() !== null
}

export function requireSupabaseEnv(): SupabaseEnv {
  const env = getSupabaseEnv()
  if (!env) {
    throw new Error(
      'Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (veja docs/ADMIN-SETUP.md).',
    )
  }
  return env
}

export const PROCEDURE_IMAGES_BUCKET = 'procedure-images'

/** Prefixos de URL aceitos para a foto de um procedimento. */
export function allowedImagePrefixes(): string[] {
  const env = getSupabaseEnv()
  const prefixes = ['/images/']
  if (env) prefixes.push(`${env.url}/storage/v1/object/public/${PROCEDURE_IMAGES_BUCKET}/`)
  return prefixes
}
