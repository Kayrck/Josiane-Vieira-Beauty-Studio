import type { Metadata } from 'next'
import { Bodoni_Moda, Jost } from 'next/font/google'
import './globals.css'

const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Josiane Vieira Beauty Studio | Extensão de Cílios em Acarape - CE',
  description:
    'Especialista em extensão de cílios premium e design do olhar em Acarape - CE. Técnicas exclusivas, produtos profissionais e atendimento personalizado. Agende pelo WhatsApp.',
  keywords: [
    'extensão de cílios',
    'design do olhar',
    'brow lamination',
    'lash lifting',
    'Acarape',
    'Ceará',
    'Josiane Vieira',
    'mega volume',
    'fox eyes',
  ],
  authors: [{ name: 'Josiane Vieira Beauty Studio' }],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Josiane Vieira Beauty Studio',
    description:
      'Extensão de cílios premium e design do olhar em Acarape - CE. Agende pelo WhatsApp.',
    locale: 'pt_BR',
    type: 'website',
    siteName: 'Josiane Vieira Beauty Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Josiane Vieira Beauty Studio',
    description: 'Extensão de cílios premium e design do olhar em Acarape - CE.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${bodoniModa.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  )
}
