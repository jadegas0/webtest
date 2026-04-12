'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Hero section — fullscreen cinematic opener.
 *
 * The 3-D particle cloud is rendered by the global ParticleCanvas
 * (fixed overlay in page.tsx) and positioned to the right of this text,
 * so the layout here is purely typographic.
 *
 * Animations:
 *   — Words clip-reveal from below (staggered), delay matches loader exit
 *   — Sub-copy + CTAs fade in after headline
 *   — Headline parallax-slides up on scroll
 *   — Section fades out as next section enters
 */
export default function Hero() {
  const sectionRef  = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const subRef      = useRef<HTMLDivElement>(null)
  const ctaRef      = useRef<HTMLDivElement>(null)
  const metaRef     = useRef<HTMLDivElement>(null)
  const scrollRef   = useRef<HTMLDivElement>(null)
  const reduced     = useReducedMotion()

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      if (!reduced) {
        // ── Entrance — delayed past loader slide-up (~3.0s)
        const tl = gsap.timeline({ delay: 3.05 })

        tl.to('.hero-word', {
          y: 0,
          duration: 1.0,
          stagger: 0.075,
          ease: 'power4.out',
        }, 0)

        tl.fromTo(subRef.current,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' },
          0.3,
        )

        tl.fromTo(ctaRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' },
          0.5,
        )

        tl.fromTo(metaRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          0.75,
        )

        tl.fromTo(scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          1.0,
        )

        // ── Scroll parallax — headline rises, section fades
        gsap.to(headlineRef.current, {
          y: '-15%',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })

        gsap.to(sectionRef.current, {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: '55% top',
            end: 'bottom top',
            scrub: true,
          },
        })
      } else {
        // Reduced motion — show everything immediately
        gsap.set(['.hero-word'], { y: 0 })
        gsap.set([subRef.current, ctaRef.current, metaRef.current, scrollRef.current], { opacity: 1 })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  const scrollTo = (selector: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-aura-black"
      aria-labelledby="hero-headline"
    >
      {/* Subtle ambient glow — left background */}
      <div
        className="ambient-glow w-[600px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(60,50,160,0.07) 0%, transparent 70%)',
          top: '20%', left: '-8%',
        }}
        aria-hidden="true"
      />

      {/* Content — left ~55% of screen (particle cloud fills the right) */}
      <div className="relative z-10 w-full mx-auto max-w-[1400px] px-6 lg:px-12 pt-28 pb-20 lg:pt-32 lg:pb-24">
        <div className="max-w-[680px]">

          {/* Eyebrow */}
          <div className="word-clip mb-7 overflow-hidden">
            <p
              className="hero-word font-body text-label text-aura-muted uppercase tracking-[0.32em]"
              style={{ transform: 'translateY(110%)' }}
            >
              Adaptive Universal Response Assistant
            </p>
          </div>

          {/* Main headline */}
          <div ref={headlineRef} aria-hidden="true">
            <div className="word-clip overflow-hidden">
              <h1
                id="hero-headline"
                className="hero-word font-display font-bold text-aura-white leading-none select-none"
                style={{
                  fontSize: 'clamp(5rem,12vw,13.5rem)',
                  letterSpacing: '-0.04em',
                  transform: 'translateY(110%)',
                }}
              >
                YOU
              </h1>
            </div>
            <div className="word-clip overflow-hidden">
              <h1
                className="hero-word font-display font-bold leading-none select-none"
                style={{
                  fontSize: 'clamp(5rem,12vw,13.5rem)',
                  letterSpacing: '-0.04em',
                  transform: 'translateY(110%)',
                  background: 'linear-gradient(130deg, #F8F8F8 0%, #AAAAAA 50%, #C4C8D8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                DECIDE.
              </h1>
            </div>
          </div>

          {/* Accessible heading (visually hidden duplicate) */}
          <h1 className="sr-only">You Decide. A.U.R.A — the ultimate AI home assistant.</h1>

          {/* Sub-copy */}
          <div ref={subRef} className="mt-9 opacity-0">
            <p className="font-body text-[1.075rem] text-aura-silver leading-[1.75] max-w-[440px]">
              A.U.R.A anticipates your needs, learns your life, and acts — across groceries, travel, research, smart home control, and everything in between.
            </p>
          </div>

          {/* CTAs */}
          <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-4 opacity-0">
            <a
              href="#cta"
              onClick={scrollTo('#cta')}
              className="btn-primary"
              style={{ cursor: 'none' }}
              aria-label="Request early access to A.U.R.A"
            >
              <span>Request Access</span>
              <span aria-hidden="true">→</span>
            </a>
            <a
              href="#features"
              onClick={scrollTo('#features')}
              className="btn-ghost"
              style={{ cursor: 'none' }}
              aria-label="Explore A.U.R.A capabilities"
            >
              <span>Explore</span>
            </a>
          </div>

          {/* Trust meta */}
          <div ref={metaRef} className="mt-14 flex flex-wrap items-center gap-x-7 gap-y-2 opacity-0">
            {[
              'Advanced AI',
              'Always Private',
              '256-bit Encrypted',
              'Works Offline',
            ].map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-2 font-body text-[0.65rem] text-aura-muted uppercase tracking-[0.18em]"
              >
                <span className="w-1 h-1 rounded-full bg-aura-muted flex-shrink-0" aria-hidden="true" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0"
        aria-hidden="true"
      >
        <span className="font-body text-[0.58rem] text-aura-muted tracking-[0.32em] uppercase">
          Scroll
        </span>
        <div className="w-px h-11 bg-gradient-to-b from-aura-muted to-transparent animate-pulse-slow" />
      </div>
    </section>
  )
}
