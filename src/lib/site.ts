// Registro central de conteúdo e assets do Josiane Vieira Beauty Studio.
// Edite aqui para atualizar textos e imagens institucionais do site.
//
// Os PROCEDIMENTOS (nome, preços, duração, foto, categoria, ativo/inativo) NÃO ficam
// mais aqui: são gerenciados pelo painel /admin e guardados no banco (Supabase).
// Veja src/lib/catalog e docs/ADMIN-SETUP.md.

export const BRAND = {
  name: 'Josiane Vieira',
  full: 'Josiane Vieira Beauty Studio',
  tagline: 'Design do olhar & extensão de cílios premium',
  phone: '+55 (85) 99661-4346',
  instagram: 'https://www.instagram.com/lashesbyjosiane/',
  instagramHandle: '@lashesbyjosiane',
  address: 'Rua José Cristino, 76',
  city: 'Acarape · CE · 62785-000',
  mapsUrl:
    'https://maps.google.com/?q=Rua+José+Cristino,+76,+Acarape,+CE,+62785-000,+Brasil',
  hours: 'Seg – Sáb · 08h – 19h',
}

const u = (id: string, w = 1200, h = 1500) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`

export const IMAGES = {
  heroPortrait: '/images/hero-portrait.png',
  heroEye: '/images/hero-eye.png',
  heroLashes: '/images/img1.png',
  about: '/images/josiane.png',
  studio: u('1633681121751-e4a0392602b8', 1200, 900),
  beforeAfterBefore: '/images/antes.png',
  beforeAfterAfter: '/images/depois.png',
  ctaBg: u('1674049406467-824ea37c7184', 1600, 1000),
}

export const STATS = [
  { value: '+1000', label: 'Atendimentos realizados' },
  { value: '1 ano', label: 'Apaixonada pelo olhar' },
  { value: 'PRO', label: 'Especialista em cílios' },
  { value: '5.0', label: 'Avaliação das clientes' },
]

export const DIFFERENTIALS = [
  {
    title: 'Atendimento personalizado',
    text: 'Cada técnica é escolhida a partir do seu formato de olhos e estilo de vida.',
  },
  {
    title: 'Produtos profissionais',
    text: 'Insumos premium, hipoalergênicos e de alta durabilidade.',
  },
  {
    title: 'Higienização completa',
    text: 'Protocolo rigoroso de biossegurança a cada atendimento.',
  },
  {
    title: 'Técnicas atualizadas',
    text: 'Aperfeiçoamento constante nas tendências mundiais do olhar.',
  },
  {
    title: 'Naturalidade',
    text: 'Resultados que realçam a sua beleza natural, com leveza e harmonia.',
  },
  {
    title: 'Conforto & durabilidade',
    text: 'Aplicação leve, confortável e feita para durar semanas.',
  },
]

export const PROCESS = [
  {
    step: '01',
    title: 'Agendamento',
    text: 'Escolha a técnica ideal e reserve seu horário com confirmação de 50%.',
  },
  {
    step: '02',
    title: 'Preparação',
    text: 'Acolhimento, análise do olhar e higienização dos fios naturais.',
  },
  {
    step: '03',
    title: 'Procedimento',
    text: 'Aplicação minuciosa, fio a fio, em um ambiente tranquilo e relaxante.',
  },
  {
    step: '04',
    title: 'Cuidados',
    text: 'Orientações personalizadas para prolongar a durabilidade do resultado.',
  },
  {
    step: '05',
    title: 'Retorno',
    text: 'Acompanhamento próximo para garantir conforto e saúde ocular.',
  },
  {
    step: '06',
    title: 'Manutenção',
    text: 'Reposição dos fios para manter o olhar sempre impecável.',
  },
]

export const GALLERY = [
  '/images/mega-volume.png',
  '/images/fox-eyes.png',
  '/images/brow-lamination.png',
  '/images/volume-brasileiro.png',
  '/images/lash-lifting.png',
  '/images/volume-power.png',
  '/images/design-henna.png',
  '/images/volume-soft.png',
]

export const FAQ = [
  {
    q: 'Quanto tempo dura a extensão de cílios?',
    a: 'Em média de 3 a 4 semanas, variando conforme o ciclo natural dos seus fios e os cuidados diários. A manutenção é recomendada a cada 15–20 dias.',
  },
  {
    q: 'O procedimento dói?',
    a: 'De forma alguma. A aplicação é confortável e relaxante — muitas clientes acabam dormindo durante o atendimento.',
  },
  {
    q: 'Posso molhar e usar maquiagem?',
    a: 'Sim. Após as primeiras 24h você retoma sua rotina normalmente, evitando produtos oleosos na região dos olhos.',
  },
  {
    q: 'Preciso remover os cílios depois?',
    a: 'Sim. A remoção profissional após o período indicado é obrigatória para preservar a saúde e a integridade dos seus fios naturais.',
  },
  {
    q: 'Como faço para agendar?',
    a: 'Pelo WhatsApp. A reserva é confirmada com 50% do valor e a confirmação final acontece um dia antes do atendimento.',
  },
]

export const NAV_LINKS = [
  { label: 'Início', href: '#inicio' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Procedimentos', href: '#procedimentos' },
  { label: 'Resultados', href: '#resultados' },
  { label: 'Processo', href: '#processo' },
  { label: 'Dúvidas', href: '#faq' },
  { label: 'Contato', href: '#contato' },
]
