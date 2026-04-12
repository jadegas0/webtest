'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const FEATURES = [
  {
    id: '01',
    title: 'Smart Ordering',
    headline: 'Your pantry, always full.',
    description: 'A.U.R.A learns your household preferences and reorder cadence, placing grocery and essentials orders before you run out — automatically, or with a single confirmation.',
    tags: ['Groceries', 'Pharmacy', 'Household'],
    accentColor: '#7B8FFF',
  },
  {
    id: '02',
    title: 'Travel & Dining',
    headline: 'Every experience, curated.',
    description: 'From Michelin-starred reservations to last-minute flights and hotel upgrades — A.U.R.A handles the logistics so you focus on living. Preferences remembered, every time.',
    tags: ['Flights', 'Hotels', 'Restaurants'],
    accentColor: '#C4A87A',
  },
  {
    id: '03',
    title: 'Deep Research',
    headline: 'Information distilled to signal.',
    description: 'Ask anything complex. A.U.R.A synthesises across thousands of sources, validates claims, and delivers a clear, cited brief — whether it\'s market data, medical literature, or legal precedent.',
    tags: ['Market Intel', 'Academic', 'Legal'],
    accentColor: '#78C8A0',
  },
  {
    id: '04',
    title: 'Smart Home',
    headline: 'Your space, perfectly tuned.',
    description: 'Climate, lighting, security, entertainment — A.U.R.A orchestrates every connected device around your routines, presence, and mood. Arrive home to exactly the environment you want.',
    tags: ['Climate', 'Security', 'Lighting'],
    accentColor: '#E0899A',
  },
  {
    id: '05',
    title: 'Finance & Admin',
    headline: 'Your financial co-pilot.',
    description: 'Bill payments, subscription management, expense tracking, and investment briefings — all monitored and actioned on your behalf, with full auditability and control.',
    tags: ['Payments', 'Investments', 'Expenses'],
    accentColor: '#A0C8E8',
  },
  {
    id: '06',
    title: 'Health & Wellness',
    headline: 'Proactive, not reactive.',
    description: 'A.U.R.A monitors your health data, schedules appointments, manages prescriptions, and nudges you toward balance — working quietly in the background of a well-lived life.',
    tags: ['Medical', 'Fitness', 'Sleep'],
    accentColor: '#D4A8FF',
  },
]

/**
 * Features section — scroll-pinned horizontal narrative.
 * Each feature card animates in as the user scrolls through the pin window.
 */
export default function Features() {
  const sectionRef  = useRef<HTMLElement>(null)
  const trackRef    = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const reduced     = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const cards = trackRef.current?.querySelectorAll('.feature-card') ?? []

      // Pin the section and scrub through cards
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${FEATURES.length * 120}%`,
        pin: true,
        scrub: 0.8,
        onUpdate(self) {
          const idx = Math.round(self.progress * (FEATURES.length - 1))
          setActive(Math.min(idx, FEATURES.length - 1))
        },
      })

      // Each card reveal
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40, scale: 0.97 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `top+=${i * 100}% top`,
              end: `top+=${(i + 1) * 100}% top`,
              toggleActions: 'play reverse play reverse',
              scrub: false,
            },
          },
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative bg-aura-black overflow-hidden"
      aria-label="A.U.R.A capabilities"
      style={{ height: '100vh' }}
    >
      <div className="h-full mx-auto max-w-[1400px] px-6 lg:px-12 flex flex-col justify-center">
        {/* Header */}
        <div className="flex items-end justify-between mb-12 lg:mb-16">
          <div>
            <p className="font-body text-label text-aura-muted uppercase tracking-[0.3em] mb-3">
              Capabilities
            </p>
            <h2
              className="font-display font-bold text-aura-white"
              style={{ fontSize: 'clamp(2rem,3.5vw,4rem)', letterSpacing: '-0.025em', lineHeight: 1.1 }}
            >
              Everything You Need.<br />Nothing You Don't.
            </h2>
          </div>

          {/* Progress indicator */}
          <div className="hidden lg:flex items-center gap-3">
            {FEATURES.map((_, i) => (
              <div
                key={i}
                className="h-px transition-all duration-500 ease-expo-out"
                style={{
                  width: i === active ? 32 : 12,
                  background: i === active ? '#F8F8F8' : 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Cards grid */}
        <div
          ref={trackRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5"
        >
          {FEATURES.map((f, i) => (
            <article
              key={f.id}
              className={`feature-card glass rounded-none p-7 lg:p-8 transition-all duration-500 border-l-0 ${
                i === active ? 'opacity-100' : 'opacity-40'
              }`}
              style={{
                borderLeft: i === active ? `2px solid ${f.accentColor}` : '2px solid transparent',
                transition: 'opacity 0.4s ease, border-color 0.4s ease',
              }}
              aria-current={i === active ? 'true' : undefined}
            >
              <div className="flex items-start justify-between mb-6">
                <span
                  className="font-display text-[0.65rem] font-bold tracking-[0.25em] uppercase"
                  style={{ color: f.accentColor }}
                >
                  {f.id}
                </span>
                {/* Accent dot */}
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: f.accentColor, opacity: i === active ? 1 : 0.3 }}
                  aria-hidden="true"
                />
              </div>

              <h3 className="font-display font-semibold text-aura-white mb-2" style={{ fontSize: '1.0625rem', letterSpacing: '-0.01em' }}>
                {f.headline}
              </h3>
              <p className="font-body text-sm text-aura-silver leading-relaxed mb-6">
                {f.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {f.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-body text-[0.6rem] uppercase tracking-[0.15em] px-2.5 py-1 border border-[rgba(255,255,255,0.08)] text-aura-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Section label */}
        <div className="mt-10 flex items-center justify-between">
          <span className="font-body text-[0.65rem] text-aura-muted tracking-[0.2em] uppercase">
            Scroll to explore
          </span>
          <span className="font-display font-bold text-aura-muted text-[0.7rem] tracking-[0.3em]">
            {String(active + 1).padStart(2, '0')} / {String(FEATURES.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  )
}
