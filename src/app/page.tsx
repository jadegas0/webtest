'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

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

// Dynamic — Three.js / browser APIs only
const LoadingScreen  = dynamic(() => import('@/components/ui/LoadingScreen'),              { ssr: false })
const Cursor         = dynamic(() => import('@/components/ui/Cursor'),                     { ssr: false })
const ParticleCanvas = dynamic(() => import('@/components/three/ParticleCanvas'),          { ssr: false })

// Lenis smooth scroll
import { useLenis } from '@/hooks/useLenis'

/**
 * Root page.
 *
 * Scroll → section mapping:
 *   Each section has a ScrollTrigger waypoint. When a section enters the
 *   viewport past 55%, GSAP tweens scrollState.current.section to that
 *   section's index (0–5). ParticleField reads this ref every frame and
 *   morphs the particle cloud toward the matching shape.
 *
 * Section → shape mapping (defined in shapes.ts):
 *   0 Hero      → sphere        (right side of screen)
 *   1 Brand     → rings         (centre)
 *   2 Features  → clusters      (right side)
 *   3 Showcase  → helix         (left side)
 *   4 Stats     → grid          (upper right)
 *   5 CTA       → denseSphere   (upper centre)
 */
export default function Page() {
  const [loaded, setLoaded] = useState(false)

  // Mutable ref: GSAP animates .section, ParticleField reads it every frame
  const scrollState = useRef<{ section: number }>({ section: 0 })

  // Lenis smooth scroll (wired to GSAP ticker in the hook)
  useLenis()

  // Lock body scroll during loading screen
  useEffect(() => {
    document.body.style.overflow = loaded ? '' : 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [loaded])

  // Wire scroll → section index → particle morph
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const SECTIONS = [
      { id: '#hero',     idx: 0 },
      { id: '#brand',    idx: 1 },
      { id: '#features', idx: 2 },
      { id: '#showcase', idx: 3 },
      { id: '#stats',    idx: 4 },
      { id: '#cta',      idx: 5 },
    ]

    const triggers = SECTIONS.map(({ id, idx }) =>
      ScrollTrigger.create({
        trigger: id,
        start: 'top 58%',
        onEnter:     () => gsap.to(scrollState.current, { section: idx, duration: 1.0, ease: 'power2.inOut', overwrite: true }),
        onEnterBack: () => gsap.to(scrollState.current, { section: idx, duration: 1.0, ease: 'power2.inOut', overwrite: true }),
      }),
    )

    return () => triggers.forEach((t) => t.kill())
  }, [])

  return (
    <>
      {/* Film grain — fixed atmospheric texture */}
      <GrainOverlay />

      {/* Custom cursor — desktop only (hidden on touch via CSS) */}
      <Cursor />

      {/* Global particle canvas — fixed viewport overlay, pointer-events none */}
      <ParticleCanvas scrollState={scrollState} />

      {/* Loading screen — slide-up exit reveals page */}
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

      {/* Sections */}
      <main id="main-content">
        <Hero />
        <Brand />
        <Features />
        <Showcase />
        <Stats />
        <CTA />
      </main>

      <Footer />
    </>
  )
}
