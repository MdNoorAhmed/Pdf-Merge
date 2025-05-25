import Hero from './components/Hero'
import CTA from './components/CTA'
import Footer from './components/Footer'

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-[#5b21b6] text-white font-sans">
      {/* Main content fills space and centers */}
      <main className="flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <Hero />
          <CTA />
        </div>
      </main>

      {/* Footer pinned bottom */}
      <Footer />
    </div>
  )
}
