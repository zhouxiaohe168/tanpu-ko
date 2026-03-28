import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Pricing } from "@/components/pricing"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        <Hero />
        <Features />
        <Pricing />
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}
