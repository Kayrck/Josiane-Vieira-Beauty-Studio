import type { Metadata } from 'next'
import { ToastProvider } from '@/components/admin/ui'

// Tudo em /admin depende da sessão de quem acessa: nunca é pré-renderizado nem cacheado.
export const dynamic = 'force-dynamic'

// A área administrativa nunca é indexada por buscadores.
export const metadata: Metadata = {
  title: { default: 'Painel · Josiane Vieira', template: '%s · Painel Josiane Vieira' },
  robots: { index: false, follow: false, nocache: true },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-[100svh] bg-background font-body text-foreground antialiased">{children}</div>
    </ToastProvider>
  )
}
