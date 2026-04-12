'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Three.js canvas — SSR disabled
const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-24 h-24 rounded-full border border-[rgba(255,255,255,0.1)] animate-pulse" />
    </div>
  ),
})

/**
 * Hero section — fullscreen cinematic opener.
 *
 * Layout (desktop):
 *   Left 45%: Large stacked headline + subline + CTA
 *   Right 55%: Three.js orb canvas
 *
 * Animations:
 *   — Headline words clip-reveal from below (staggered)
 *   — Tagline + CTA fade in after headline
 *   — Orb canvas fades + scales in
 *   — Parallax: headline moves up, orb moves down on scroll
 */
export default function Hero() {
  const sectionRef  = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const subRef      = useRef<HTMLDivElement>(null)
  const ctaRef      = useRef<HTMLDivElement>(null)
  const sceneRef    = useRef<HTMLDivElement>(null)
  const scrollRef   = useRef<HTMLDivElement>(null)
  const reduced     = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // ── Reveal animation (fires after loader exits ~2.9s)
      const tl = gsap.timeline({ delay: 3.0 })

      // Headline words — each line is wrapped in .word-clip/.word-inner
      tl.to('.hero-word', {
        y: 0,
        duration: 0.95,
        stagger: 0.08,
        ease: 'power4.out',
      }, 0)

      tl.fromTo(subRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        0.35,
      )

      tl.fromTo(ctaRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        0.55,
      )

      tl.fromTo(sceneRef.current,
        { opacity: 0, scale: 0.94 },
        { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out' },
        0.1,
      )

      tl.fromTo(scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        0.9,
      )

      // ── Scroll-driven parallax
      // Headline slides up faster than scroll
      gsap.to(headlineRef.current, {
        y: '-18%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      // Orb drifts down (opposite direction)
      gsap.to(sceneRef.current, {
        y: '12%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      // Fade out entire hero as it scrolls away
      gsap.to(sectionRef.current, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '60% top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  const handleCTA = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const el = document.querySelector('#cta')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-aura-black"
      aria-label="Hero — You Decide"
    >
      {/* Ambient glow blobs */}
      <div
        className="ambient-glow w-[700px] h-[700px]"
        style={{
          background: 'radial-gradient(circle, rgba(80,70,180,0.08) 0%, transparent 70%)',
          top: '10%', right: '-10%',
        }}
        aria-hidden="true"
      />
      <div
        className="ambient-glow w-[500px] h-[500px]"
        style={{
          background: 'radial-gradient(circle, rgba(40,30,100,0.06) 0%, transparent 70%)',
          bottom: '5%', left: '-5%',
        }}
        aria-hidden="true"
      />

      {/* Main layout grid */}
      <div className="relative z-10 w-full mx-auto max-w-[1400px] px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-0 items-center min-h-screen pt-24 pb-16">

        {/* ── Left: Text content */}
        <div className="flex flex-col justify-center">
          {/* Eyebrow */}
          <div className="word-clip mb-6 lg:mb-8">
            <p
              className="hero-word font-body text-label text-aura-muted uppercase tracking-[0.3em]"
              style={{ transform: 'translateY(110%)' }}
            >
              AI Home Assistant
            </p>
          </div>

          {/* Main headline — "YOU" */}
          <div ref={headlineRef}>
            <div className="word-clip overflow-hidden">
              <h1
                className="hero-word font-display font-bold text-aura-white leading-none"
                style={{
                  fontSize: 'clamp(5.5rem,13vw,14rem)',
                  letterSpacing: '-0.04em',
                  transform: 'translateY(110%)',
                }}
              >
                YOU
              </h1>
            </div>

            {/* "DECIDE." — different style */}
            <div className="word-clip overflow-hidden">
              <h1
                className="hero-word font-display font-bold leading-none"
                style={{
                  fontSize: 'clamp(5.5rem,13vw,14rem)',
                  letterSpacing: '-0.04em',
                  transform: 'translateY(110%)',
                  // Chrome gradient on "DECIDE."
                  background: 'linear-gradient(135deg, #F8F8F8 0%, #9B9B9B 55%, #C4C8D8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                DECIDE.
              </h1>
            </div>
          </div>

          {/* Sub-copy */}
          <div ref={subRef} className="mt-8 lg:mt-10 max-w-[420px] opacity-0">
            <p className="font-body text-[1.0625rem] text-aura-silver leading-relaxed">
              A.U.R.A anticipates your needs, learns your preferences, and acts on your behalf — across groceries, travel, research, smart home, and beyond.
            </p>
          </div>

          {/* CTAs */}
          <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-4 opacity-0">
            <a
              href="#cta"
              onClick={handleCTA}
              className="btn-primary"
              style={{ cursor: 'none' }}
            >
              <span>Request Access</span>
              <span aria-hidden="true">→</span>
            </a>
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="btn-ghost"
              style={{ cursor: 'none' }}
            >
              <span>Explore</span>
            </a>
          </div>

          {/* Meta tags */}
          <div className="mt-14 flex items-center gap-6">
            {['GPT-4 Class AI', 'Always On', '256-bit Encrypted'].map((tag) => (
              <span
                key={tag}
                className="font-body text-[0.65rem] text-aura-muted uppercase tracking-[0.18em]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── Right: 3D Scene */}
        <div
          ref={sceneRef}
          className="relative w-full h-[55vw] max-h-[680px] min-h-[320px] lg:h-full opacity-0"
          aria-hidden="true"
        >
          {/* Mobile gradient mask */}
          <div
            className="absolute inset-0 z-10 lg:hidden"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 50%, rgba(2,2,2,0.8) 100%)',
            }}
          />
          <HeroScene />
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0"
        aria-hidden="true"
      >
        <span className="font-body text-[0.6rem] text-aura-muted tracking-[0.3em] uppercase">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-aura-muted to-transparent animate-pulse-slow" />
      </div>
    </section>
  )
}
