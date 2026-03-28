import { Header } from "@/components/header"
import { QueryForm } from "@/components/query-form"
import { MapContainer } from "@/components/map-container"
import { MobileNav } from "@/components/mobile-nav"

export default function QueryPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col pb-20 md:pb-0 lg:flex-row">
        {/* Query Form - Left side on desktop, top on mobile */}
        <aside className="w-full shrink-0 border-b border-border/40 bg-card/50 p-4 lg:w-80 lg:border-b-0 lg:border-r lg:overflow-y-auto lg:max-h-[calc(100vh-4rem)] xl:w-96">
          <QueryForm />
        </aside>
        
        {/* Map - Right side on desktop, bottom on mobile */}
        <div className="flex-1 p-4">
          <MapContainer className="h-[400px] lg:h-full" />
        </div>
      </main>
      <MobileNav />
    </div>
  )
}
