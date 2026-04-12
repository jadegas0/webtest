'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Layout
import Navigation   from '@/components/layout/Navigation'
import Footer       from '@/components/layout/Footer'

// Sections
import Hero         from '@/components/sections/Hero'
import Brand        from '@/components/sections/Brand'
import Features     from '@/components/sections/Features'
import Showcase     from '@/components/sections/Showcase'
import Stats        from '@/components/sections/Stats'
import CTA          from '@/components/sections/CTA'

// UI
import GrainOverlay from '@/components/ui/GrainOverlay'
import SoundToggle  from '@/components/ui/SoundToggle'

// Dynamic — cursor uses browser APIs, skip SSR
const LoadingScreen = dynamic(() => import('@/components/ui/LoadingScreen'), { ssr: false })
const Cursor        = dynamic(() => import('@/components/ui/Cursor'),        { ssr: false })

// Lenis smooth scroll — client only
import { useLenis } from '@/hooks/useLenis'

/**
 * Main page component.
 * Orchestrates:
 *   1. Loading screen (shown until loaded)
 *   2. Smooth scroll initialisation (Lenis + GSAP ScrollTrigger)
 *   3. Grain overlay (atmospheric texture)
 *   4. Custom cursor
 *   5. Navigation, sections, footer
 */
export default function Page() {
  const [loaded, setLoaded] = useState(false)

  // Lenis smooth scroll — wired to GSAP ticker
  useLenis()

  // Lock body scroll during loading
  useEffect(() => {
    if (!loaded) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [loaded])

  return (
    <>
      {/* Atmospheric grain */}
      <GrainOverlay />

      {/* Custom cursor (desktop only — hidden on touch devices via CSS) */}
      <Cursor />

      {/* Loading screen — unmounts after animation */}
      {!loaded && (
        <LoadingScreen onComplete={() => setLoaded(true)} />
      )}

      {/* Sound toggle — fixed bottom-left */}
      <div className="fixed bottom-6 left-6 z-50" aria-label="Audio controls">
        <SoundToggle />
      </div>

      {/* Skip to main content — keyboard accessibility */}
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-aura-white focus:text-aura-black focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>

      {/* Navigation */}
      <Navigation />

      {/* Main content */}
      <main id="main-content">
        <Hero />
        <Brand />
        <Features />
        <Showcase />
        <Stats />
        <CTA />
      </main>

      {/* Footer */}
      <Footer />
    </>
  )
}
