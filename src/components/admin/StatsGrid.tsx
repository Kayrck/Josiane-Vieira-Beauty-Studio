import { cn } from '@/components/ui/utils'
import { cardClass } from './styles'

export function StatsGrid({
  total,
  active,
  inactive,
  categories,
}: {
  total: number
  active: number
  inactive: number
  categories: number
}) {
  const items = [
    { label: 'Procedimentos', value: total },
    { label: 'Ativos no site', value: active },
    { label: 'Inativos', value: inactive },
    { label: 'Categorias', value: categories },
  ]

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className={cn(cardClass, 'p-4')}>
          <dt className="text-xs text-espresso/60">{item.label}</dt>
          <dd className="mt-1.5 font-display text-[2rem] leading-none text-espresso">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
