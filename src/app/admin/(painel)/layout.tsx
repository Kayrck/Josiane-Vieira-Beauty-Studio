import { AdminHeader } from '@/components/admin/AdminHeader'
import { requireAdmin } from '@/lib/auth'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  // Primeira barreira. Cada página e cada Server Action confere o acesso de novo
  // (em Next.js o layout não é reexecutado a cada navegação).
  const { user } = await requireAdmin()

  return (
    <>
      <AdminHeader email={user.email ?? ''} />
      <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-6 sm:px-6 md:pt-10">{children}</main>
    </>
  )
}
