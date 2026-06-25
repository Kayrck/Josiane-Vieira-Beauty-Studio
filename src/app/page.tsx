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

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <Navbar />
      <FloatingActions />
      <main>
        <Hero />
        <About />
        <Differentials />
        <Procedures />
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
