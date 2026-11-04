import type { NextConfig } from 'next'

type RemotePattern = NonNullable<NonNullable<NextConfig['images']>['remotePatterns']>[number]

const remotePatterns: RemotePattern[] = [{ protocol: 'https', hostname: 'images.unsplash.com' }]

// Fotos dos procedimentos enviadas pelo painel ficam no Supabase Storage (bucket público).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
if (supabaseUrl) {
  try {
    const url = new URL(supabaseUrl)
    remotePatterns.push({
      protocol: url.protocol === 'http:' ? 'http' : 'https',
      hostname: url.hostname,
      port: url.port,
      pathname: '/storage/v1/object/public/**',
    })
  } catch {
    // URL inválida: o próprio app mostra o aviso de configuração.
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
    // Cada foto enviada ganha um nome novo (nunca é sobrescrita), então o cache pode ser longo.
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
  async headers() {
    return [
      {
        // Área administrativa: nunca cacheada, nunca indexada, nunca dentro de um iframe.
        source: '/admin/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'same-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
