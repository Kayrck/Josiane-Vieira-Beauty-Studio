// Catálogo de contingência.
//
// Usado SOMENTE quando o Supabase ainda não foi configurado (ambiente local sem
// .env.local, previews sem variáveis). Assim o site continua no ar, idêntico ao
// que já era, enquanto a infraestrutura não está pronta.
//
// Com o Supabase configurado, o site NUNCA usa estes dados: ele lê o banco, e
// qualquer falha de leitura vira erro (em vez de mostrar preços antigos).
// Estes valores são o mesmo conteúdo carregado pela migration
// `20261104120100_seed_catalogo_atual.sql`.

import type { Category, Procedure } from './types'

export const FALLBACK_CATEGORIES: Category[] = [
  { id: 'extensao-de-cilios', slug: 'extensao-de-cilios', name: 'Extensão de cílios', sortOrder: 10 },
  { id: 'design-do-olhar', slug: 'design-do-olhar', name: 'Design do olhar', sortOrder: 20 },
]

type FallbackSeed = Omit<Procedure, 'id' | 'active' | 'updatedAt'>

const SEED: FallbackSeed[] = [
  {
    slug: 'mega-volume',
    name: 'Mega Volume',
    description: 'Fio preto · volume intenso e marcante',
    price: 149.99,
    extraPrices: [],
    priceNote: 'Exceto manutenção',
    durationMinutes: 150,
    categoryId: 'extensao-de-cilios',
    image: '/images/mega-volume.png',
    tag: 'Mais desejado',
    sortOrder: 10,
  },
  {
    slug: 'fox-eyes',
    name: 'Volume Fox Eyes',
    description: 'Fio preto · efeito olhar puxado e felino',
    price: 129.99,
    extraPrices: [{ label: 'Manutenção', amount: 89.99 }],
    priceNote: null,
    durationMinutes: 135,
    categoryId: 'extensao-de-cilios',
    image: '/images/fox-eyes.png',
    tag: 'Tendência',
    sortOrder: 20,
  },
  {
    slug: 'volume-power',
    name: 'Volume Power',
    description: 'Fios marrom e preto · profundidade natural',
    price: 109.99,
    extraPrices: [{ label: 'Manutenção', amount: 80 }],
    priceNote: null,
    durationMinutes: 120,
    categoryId: 'extensao-de-cilios',
    image: '/images/volume-power.png',
    tag: null,
    sortOrder: 30,
  },
  {
    slug: 'volume-soft',
    name: 'Volume Soft / Sirena',
    description: 'Fio preto · leveza e delicadeza',
    price: 99.99,
    extraPrices: [{ label: 'Manutenção', amount: 80 }],
    priceNote: null,
    durationMinutes: 120,
    categoryId: 'extensao-de-cilios',
    image: '/images/volume-soft.png',
    tag: null,
    sortOrder: 40,
  },
  {
    slug: 'volume-brasileiro',
    name: 'Volume Brasileiro',
    description: 'Fios marrom e preto · naturalidade absoluta',
    price: 99.99,
    extraPrices: [{ label: 'Manutenção', amount: 70 }],
    priceNote: null,
    durationMinutes: 105,
    categoryId: 'extensao-de-cilios',
    image: '/images/volume-brasileiro.png',
    tag: null,
    sortOrder: 50,
  },
  {
    slug: 'brow-lamination',
    name: 'Brow Lamination',
    description: 'Sobrancelhas alinhadas, preenchidas e fixadas',
    price: 89.99,
    extraPrices: [],
    priceNote: null,
    durationMinutes: 60,
    categoryId: 'design-do-olhar',
    image: '/images/brow-lamination.png',
    tag: null,
    sortOrder: 60,
  },
  {
    slug: 'design-henna',
    name: 'Design com Henna',
    description: 'Design completo',
    price: 34.99,
    extraPrices: [{ label: 'Sem henna', amount: 24.99 }],
    priceNote: null,
    durationMinutes: 40,
    categoryId: 'design-do-olhar',
    image: '/images/design-henna.png',
    tag: null,
    sortOrder: 70,
  },
  {
    slug: 'lash-lifting',
    name: 'Lash Lifting',
    description: 'Curvatura natural dos seus próprios cílios',
    price: 89.99,
    extraPrices: [],
    priceNote: null,
    durationMinutes: 60,
    categoryId: 'design-do-olhar',
    image: '/images/lash-lifting.png',
    tag: null,
    sortOrder: 80,
  },
]

export const FALLBACK_PROCEDURES: Procedure[] = SEED.map((p) => ({
  ...p,
  id: p.slug,
  active: true,
  updatedAt: null,
}))
