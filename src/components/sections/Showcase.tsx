'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const SCENARIOS = [
  {
    number: '01',
    scene:  'Morning',
    title:  'You wake up. A.U.R.A already has.',
    body:   'While you slept, your calendar was reviewed, traffic checked, breakfast preferences pre-ordered, and your 9AM briefing summarised. Your morning, compressed into three minutes.',
    label:  'Daily Intelligence',
    bg:     'linear-gradient(135deg, #0A0A14 0%, #111122 50%, #0A0A10 100%)',
    accent: '#8A90FF',
  },
  {
    number: '02',
    scene:  'Midday',
    title:  'The lunch you didn\'t have to think about.',
    body:   'A.U.R.A noticed your usual lunch spot is fully booked, found a superior alternative nearby based on your dietary history, and reserved a table for 12:30 — confirmation in your calendar.',
    label:  'Dining',
    bg:     'linear-gradient(135deg, #100A06 0%, #1A1008 50%, #0E0808 100%)',
    accent: '#C4A87A',
  },
  {
    number: '03',
    scene:  'Evening',
    title:  'Home that knows you\'re coming.',
    body:   'Your commute is 28 minutes. A.U.R.A preheat your apartment to 22°C, dims the hallway to welcome mode, queues the playlist you always play on Thursdays, and unlocks when you\'re 200m out.',
    label:  'Smart Home',
    bg:     'linear-gradient(135deg, #08100A 0%, #0A1410 50%, #060E08 100%)',
    accent: '#78C8A0',
  },
]

/**
 * Showcase section — cinematic use-case scenes.
 * Large scenario cards with parallax image-style reveals.
 */
export default function Showcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced    = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Each scenario card reveals with scale + clip-path
      gsap.utils.toArray<HTMLElement>('.scenario-card').forEach((card) => {
        const inner = card.querySelector('.scenario-inner')
        const title = card.querySelector('.scenario-title')
        const body  = card.querySelector('.scenario-body')
        const tag   = card.querySelector('.scenario-tag')

        gsap.fromTo(
          card,
          { clipPath: 'inset(8% 0% 8% 0%)', opacity: 0 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          },
        )

        gsap.fromTo(
          [tag, title, body],
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          },
        )

        // Subtle inner parallax
        if (inner) {
          gsap.fromTo(
            inner,
            { y: '-8%' },
            {
              y: '8%',
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          )
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      id="showcase"
      className="bg-aura-black py-24 lg:py-36"
      aria-label="A.U.R.A in your day"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <p className="font-body text-label text-aura-muted uppercase tracking-[0.3em] mb-3">
              A Day With A.U.R.A
            </p>
            <h2
              className="font-display font-bold text-aura-white"
              style={{ fontSize: 'clamp(2rem,3.5vw,4rem)', letterSpacing: '-0.025em', lineHeight: 1.1 }}
            >
              Three moments.<br />Infinite decisions handled.
            </h2>
          </div>
          <p className="font-body text-sm text-aura-silver max-w-[320px] leading-relaxed">
            These are real scenarios from real users. A.U.R.A doesn't demo well — it has to be lived.
          </p>
        </div>

        {/* Scenario cards */}
        <div className="space-y-6 lg:space-y-8">
          {SCENARIOS.map((s, i) => (
            <article
              key={s.number}
              className="scenario-card relative overflow-hidden"
              style={{ height: 'clamp(280px, 38vw, 480px)' }}
            >
              {/* Background gradient */}
              <div
                className="scenario-inner absolute inset-0 scale-110"
                style={{ background: s.bg }}
                aria-hidden="true"
              />

              {/* Accent glow */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: `radial-gradient(ellipse 60% 70% at ${i % 2 === 0 ? '80%' : '20%'} 50%, ${s.accent}20 0%, transparent 70%)`,
                }}
                aria-hidden="true"
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
                <div className="flex items-start justify-between">
                  <div className="max-w-[600px]">
                    <p className="scenario-tag font-body text-label uppercase tracking-[0.25em] mb-4" style={{ color: s.accent }}>
                      {s.label} — {s.scene}
                    </p>
                    <h3
                      className="scenario-title font-display font-bold text-aura-white mb-4"
                      style={{ fontSize: 'clamp(1.4rem,2.5vw,2.5rem)', letterSpacing: '-0.02em', lineHeight: 1.2 }}
                    >
                      {s.title}
                    </h3>
                    <p className="scenario-body font-body text-sm text-aura-silver leading-relaxed max-w-[480px]">
                      {s.body}
                    </p>
                  </div>

                  {/* Large number */}
                  <div
                    className="hidden lg:block font-display font-bold leading-none"
                    style={{
                      fontSize: 'clamp(4rem,8vw,9rem)',
                      color: 'rgba(255,255,255,0.04)',
                      letterSpacing: '-0.05em',
                      alignSelf: 'flex-end',
                    }}
                    aria-hidden="true"
                  >
                    {s.number}
                  </div>
                </div>
              </div>

              {/* Bottom border accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${s.accent}60, transparent)` }}
                aria-hidden="true"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
