import { Navbar } from '@/components/site/Navbar'
import { FloatingActions } from '@/components/site/FloatingActions'
import { Hero } from '@/components/site/Hero'
import { About } from '@/components/site/About'
import { Differentials } from '@/components/site/Differentials'
import { Procedures } from '@/components/site/Procedures'
import { BeforeAfter } from '@/components/site/BeforeAfter'
import { Gallery } from '@/components/site/Gallery'
import { Process } from '@/components/site/Process'
import { Protocols } from '@/components/site/Protocols'
import { Faq } from '@/components/site/Faq'
import { FinalCta } from '@/components/site/FinalCta'
import { Footer } from '@/components/site/Footer'
import { getPublicCatalog } from '@/lib/catalog/queries'

// Página estática (rápida, servida pela CDN) que se atualiza sozinha:
//  • na hora, quando a administradora salva algo no painel (revalidatePath nas Server Actions);
//  • no máximo a cada 60 s, como rede de segurança para qualquer alteração feita direto no banco.
export const revalidate = 60

export default async function Home() {
  const catalog = await getPublicCatalog()

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <Navbar />
      <FloatingActions />
      <main>
        <Hero />
        <About />
        <Differentials />
        <Procedures procedures={catalog.procedures} categories={catalog.categories} />
        <BeforeAfter />
        <Gallery />
        <Process />
        <Protocols />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
