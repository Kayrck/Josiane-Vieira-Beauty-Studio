// Central content + asset registry for Josiane Vieira Beauty Studio.
// Edit values here to update the site copy, prices and imagery.

export const BRAND = {
  name: "Josiane Vieira",
  full: "Josiane Vieira Beauty Studio",
  tagline: "Design do olhar & extensão de cílios premium",
  // Replace with the studio's real contact details.
  whatsapp: "5599999999999",
  whatsappLabel: "(99) 99999-9999",
  instagram: "https://instagram.com",
  instagramHandle: "@josianevieira.studio",
  address: "Rua das Acácias, 128 · Sala 04 · Centro",
  city: "Belo Horizonte · MG",
  mapsUrl: "https://maps.google.com",
  hours: "Seg – Sáb · 08h às 19h",
};

export const waLink = (message?: string) =>
  `https://wa.me/${BRAND.whatsapp}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;

const u = (id: string, w = 1200, h = 1500) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

export const IMAGES = {
  heroPortrait: u("1674932668403-33398b81c92f", 1100, 1400),
  heroEye: u("1612864271882-5107e9e3b0ce", 800, 800),
  heroLashes: u("1639629509821-c54cdd984227", 800, 600),
  about: u("1616639943825-e0fbad20a3d3", 1000, 1300),
  studio: u("1633681121751-e4a0392602b8", 1200, 900),
  beforeAfterBefore: u("1530898564308-d1ae7bb8bfec", 1200, 800),
  beforeAfterAfter: u("1639629509821-c54cdd984227", 1200, 800),
  ctaBg: u("1674049406467-824ea37c7184", 1600, 1000),
};

export type Procedure = {
  id: string;
  name: string;
  price: string;
  detail: string;
  maintenance?: string;
  duration: string;
  image: string;
  tag?: string;
};

export const PROCEDURES: Procedure[] = [
  {
    id: "mega-volume",
    name: "Mega Volume",
    price: "R$ 149,99",
    detail: "Fio preto · volume intenso e marcante",
    maintenance: "Exceto manutenção",
    duration: "≈ 2h30",
    image: u("1777262080995-da4a45f51af8", 900, 1100),
    tag: "Mais desejado",
  },
  {
    id: "fox-eyes",
    name: "Volume Fox Eyes",
    price: "R$ 129,99",
    detail: "Fio preto · efeito olhar puxado e felino",
    maintenance: "Manutenção R$ 89,99",
    duration: "≈ 2h15",
    image: u("1728432757040-1579d710f607", 900, 1100),
    tag: "Tendência",
  },
  {
    id: "volume-power",
    name: "Volume Power",
    price: "R$ 109,99",
    detail: "Fios marrom e preto · profundidade natural",
    maintenance: "Manutenção R$ 80",
    duration: "≈ 2h",
    image: u("1603543394745-9d100843680b", 900, 1100),
  },
  {
    id: "volume-soft",
    name: "Volume Soft / Sirena",
    price: "R$ 99,99",
    detail: "Fio preto · leveza e delicadeza",
    maintenance: "Manutenção R$ 80",
    duration: "≈ 2h",
    image: u("1588683301867-c442a9ed1389", 900, 1100),
  },
  {
    id: "volume-brasileiro",
    name: "Volume Brasileiro",
    price: "R$ 99,99",
    detail: "Fios marrom e preto · naturalidade absoluta",
    maintenance: "Manutenção R$ 70",
    duration: "≈ 1h45",
    image: u("1612864271882-5107e9e3b0ce", 900, 1100),
  },
  {
    id: "brow-lamination",
    name: "Brow Lamination",
    price: "R$ 89,99",
    detail: "Sobrancelhas alinhadas, preenchidas e fixadas",
    duration: "≈ 1h",
    image: u("1674049406179-d7bf2c263e71", 900, 1100),
  },
  {
    id: "design-henna",
    name: "Design com Henna",
    price: "R$ 34,99",
    detail: "Design completo · sem henna R$ 24,99",
    duration: "≈ 40min",
    image: u("1589710751893-f9a6770ad71b", 900, 1100),
  },
  {
    id: "lash-lifting",
    name: "Lash Lifting",
    price: "R$ 89,99",
    detail: "Curvatura natural dos seus próprios cílios",
    duration: "≈ 1h",
    image: u("1530898564308-d1ae7bb8bfec", 900, 1100),
  },
];

export const STATS = [
  { value: "+1000", label: "Atendimentos realizados" },
  { value: "1 ano", label: "Dedicada à arte do olhar" },
  { value: "PRO", label: "Especialista em cílios" },
  { value: "5.0", label: "Avaliação das clientes" },
];

export const DIFFERENTIALS = [
  {
    title: "Atendimento personalizado",
    text: "Cada técnica é escolhida a partir do seu formato de olhos e estilo de vida.",
  },
  {
    title: "Produtos profissionais",
    text: "Insumos premium, hipoalergênicos e de alta durabilidade.",
  },
  {
    title: "Higienização completa",
    text: "Protocolo rigoroso de biossegurança a cada atendimento.",
  },
  {
    title: "Técnicas atualizadas",
    text: "Aperfeiçoamento constante nas tendências mundiais do olhar.",
  },
  {
    title: "Naturalidade",
    text: "Resultados que valorizam a sua beleza — sem exageros.",
  },
  {
    title: "Conforto & durabilidade",
    text: "Aplicação leve, confortável e feita para durar semanas.",
  },
];

export const PROCESS = [
  {
    step: "01",
    title: "Agendamento",
    text: "Escolha a técnica ideal e reserve seu horário com confirmação de 50%.",
  },
  {
    step: "02",
    title: "Preparação",
    text: "Acolhimento, análise do olhar e higienização dos fios naturais.",
  },
  {
    step: "03",
    title: "Procedimento",
    text: "Aplicação minuciosa, fio a fio, em um ambiente tranquilo e relaxante.",
  },
  {
    step: "04",
    title: "Cuidados",
    text: "Orientações personalizadas para prolongar a durabilidade do resultado.",
  },
  {
    step: "05",
    title: "Retorno",
    text: "Acompanhamento próximo para garantir conforto e saúde ocular.",
  },
  {
    step: "06",
    title: "Manutenção",
    text: "Reposição dos fios para manter o olhar sempre impecável.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Marina Albuquerque",
    role: "Cliente desde 2024",
    text: "Saí do estúdio me sentindo outra pessoa. O cuidado da Josiane com cada detalhe é surreal — meu olhar nunca esteve tão bonito.",
    image: `https://images.unsplash.com/photo-1636153279424-cb5d1e00f5a2?w=200&h=200&fit=crop&auto=format&q=80`,
  },
  {
    name: "Beatriz Carvalho",
    role: "Volume Fox Eyes",
    text: "Atendimento impecável, ambiente acolhedor e um resultado natural que todo mundo elogia. Virei cliente fiel.",
    image: `https://images.unsplash.com/photo-1521620860034-0a3430d856d3?w=200&h=200&fit=crop&auto=format&q=80`,
  },
  {
    name: "Letícia Moraes",
    role: "Mega Volume",
    text: "A experiência inteira é premium, desde a recepção até a finalização. Acordo pronta todos os dias. Recomendo de olhos fechados.",
    image: `https://images.unsplash.com/photo-1440589473619-3cde28941638?w=200&h=200&fit=crop&auto=format&q=80`,
  },
  {
    name: "Camila Fonseca",
    role: "Lash Lifting",
    text: "Profissionalismo e delicadeza em cada gesto. Me senti em um verdadeiro boutique de beleza. Autoestima lá em cima!",
    image: `https://images.unsplash.com/photo-1696489283182-0446be970e40?w=200&h=200&fit=crop&auto=format&q=80`,
  },
];

export const GALLERY = [
  u("1639629509821-c54cdd984227", 800, 1000),
  u("1728432757040-1579d710f607", 800, 600),
  u("1612864271882-5107e9e3b0ce", 800, 1100),
  u("1603543394745-9d100843680b", 800, 900),
  u("1777262080995-da4a45f51af8", 800, 1000),
  u("1588683301867-c442a9ed1389", 800, 1200),
  u("1530898564308-d1ae7bb8bfec", 800, 600),
  u("1674049406179-d7bf2c263e71", 800, 900),
];

export const FAQ = [
  {
    q: "Quanto tempo dura a extensão de cílios?",
    a: "Em média de 3 a 4 semanas, variando conforme o ciclo natural dos seus fios e os cuidados diários. A manutenção é recomendada a cada 15–20 dias.",
  },
  {
    q: "O procedimento dói?",
    a: "De forma alguma. A aplicação é confortável e relaxante — muitas clientes acabam dormindo durante o atendimento.",
  },
  {
    q: "Posso molhar e usar maquiagem?",
    a: "Sim. Após as primeiras 24h você retoma sua rotina normalmente, evitando produtos oleosos na região dos olhos.",
  },
  {
    q: "Preciso remover os cílios depois?",
    a: "Sim. A remoção profissional após o período indicado é obrigatória para preservar a saúde e a integridade dos seus fios naturais.",
  },
  {
    q: "Como faço para agendar?",
    a: "Pelo WhatsApp. A reserva é confirmada com 50% do valor e a confirmação final acontece um dia antes do atendimento.",
  },
];

export const NAV_LINKS = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Procedimentos", href: "#procedimentos" },
  { label: "Resultados", href: "#resultados" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Processo", href: "#processo" },
  { label: "Dúvidas", href: "#faq" },
  { label: "Contato", href: "#contato" },
];
