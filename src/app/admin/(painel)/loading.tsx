import { Skeleton } from '@/components/admin/ui'

// Aparece na hora enquanto a página carrega: a navegação nunca parece travada.
export default function Loading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Carregando">
      <div className="space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-64 max-w-full" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-[1.4rem]" />
        ))}
      </div>
    </div>
  )
}
