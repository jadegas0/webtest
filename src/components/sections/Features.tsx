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
    description: 'From Michelin-starred reservations to last-minute flights and hotel upgrades — A.U.R.A handles the logistics so you can focus on living. Preferences remembered, every time.',
    tags: ['Flights', 'Hotels', 'Restaurants'],
    accentColor: '#C4A87A',
  },
  {
    id: '03',
    title: 'Deep Research',
    headline: 'Information distilled to signal.',
    description: 'Ask anything complex. A.U.R.A synthesises across thousands of sources, validates claims, and delivers a clear, cited brief — market data, medical literature, or legal precedent.',
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
    description: 'A.U.R.A monitors health data, schedules appointments, manages prescriptions, and nudges you toward balance — working quietly in the background of a well-lived life.',
    tags: ['Medical', 'Fitness', 'Sleep'],
    accentColor: '#D4A8FF',
  },
]

interface FeaturesProps {
  onFeatureChange?: (idx: number) => void
}

/**
 * Features section — scroll-driven card narrative.
 *
 * Architecture: outer wrapper provides scroll distance
 * (FEATURES.length × 100vh). Inner panel is `position: sticky; top: 0`
 * — it pins itself without using GSAP pin (avoids conflicts with Lenis).
 * A ScrollTrigger scrubs `progress` 0→1 over the wrapper's scroll range,
 * which drives the active-card highlight and the counter.
 *
 * Interactivity:
 *  — Click a card or progress dot → scrolls to that feature's position
 *  — Keyboard arrow keys while panel is focused → navigate features
 *  — onFeatureChange callback → drives particle shape morphing in parent
 */
export default function Features({ onFeatureChange }: FeaturesProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()

  // Notify parent whenever active changes
  useEffect(() => {
    onFeatureChange?.(active)
  }, [active, onFeatureChange])

  // Programmatically scroll to put a given feature idx in view
  const scrollToFeature = (idx: number) => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const rect    = wrapper.getBoundingClientRect()
    const top     = window.scrollY + rect.top
    const perStep = wrapper.offsetHeight / FEATURES.length
    window.scrollTo({ top: top + idx * perStep, behavior: 'smooth' })
  }

  // Keyboard navigation while the sticky panel has focus
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      scrollToFeature(Math.min(active + 1, FEATURES.length - 1))
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault()
      scrollToFeature(Math.max(active - 1, 0))
    }
  }

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Single scrubbed trigger over the whole wrapper height
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate(self) {
          const idx = Math.min(
            Math.floor(self.progress * FEATURES.length),
            FEATURES.length - 1,
          )
          setActive(idx)
        },
      })

      if (!reduced) {
        // Stagger-in all cards once section enters
        gsap.fromTo(
          '.feature-card',
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.07,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          },
        )

        // Section header
        gsap.fromTo(
          '.features-header',
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          },
        )
      }
    })

    return () => ctx.revert()
  }, [reduced])

  return (
    /**
     * Outer wrapper: provides the full scroll distance.
     * Height = FEATURES.length × 100vh so there's enough runway
     * for all features to be highlighted one by one.
     */
    <div
      ref={wrapperRef}
      id="features"
      style={{ height: `${FEATURES.length * 100}vh` }}
      aria-label="A.U.R.A capabilities"
    >
      {/* Sticky inner panel — stays in view for the whole scroll range */}
      <div
        className="sticky top-0 h-screen bg-aura-black overflow-hidden flex flex-col justify-center"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        role="region"
        aria-label="A.U.R.A capability explorer"
      >
        <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-12">

          {/* ── Header */}
          <div className="features-header flex items-end justify-between mb-10 lg:mb-12">
            <div>
              <p className="font-body text-label text-aura-muted uppercase tracking-[0.3em] mb-3">
                Capabilities
              </p>
              <h2
                className="font-display font-bold text-aura-white"
                style={{ fontSize: 'clamp(1.8rem,3vw,3.6rem)', letterSpacing: '-0.025em', lineHeight: 1.1 }}
              >
                Everything You Need.<br />
                <span
                  style={{
                    background: 'linear-gradient(120deg, #C4C8D8 0%, #F8F8F8 60%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Nothing You Don&apos;t.
                </span>
              </h2>
            </div>

            {/* Dot progress — clickable */}
            <div className="hidden lg:flex items-center gap-2.5">
              {FEATURES.map((f, i) => (
                <button
                  key={i}
                  onClick={() => scrollToFeature(i)}
                  aria-label={`Jump to ${f.title}`}
                  aria-pressed={i === active}
                  className="rounded-full transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  style={{
                    width:        i === active ? 28 : 8,
                    height:       8,
                    borderRadius: 4,
                    background:   i === active ? f.accentColor : 'rgba(255,255,255,0.15)',
                    cursor:       'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 lg:gap-4">
            {FEATURES.map((f, i) => (
              <article
                key={f.id}
                className="feature-card glass p-6 lg:p-7 cursor-none"
                onClick={() => scrollToFeature(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && scrollToFeature(i)}
                aria-current={i === active ? 'step' : undefined}
                aria-label={`${f.title}: ${f.headline}`}
                style={{
                  borderLeft:       `2px solid ${i === active ? f.accentColor : 'transparent'}`,
                  opacity:          i === active ? 1 : reduced ? 1 : 0.38,
                  transform:        i === active ? 'translateY(-3px) scale(1.01)' : 'none',
                  transition:       'opacity 0.4s ease, border-color 0.4s ease, transform 0.45s ease',
                  background:       i === active
                    ? `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`
                    : undefined,
                  boxShadow:        i === active
                    ? `0 0 0 1px ${f.accentColor}22, 0 8px 32px rgba(0,0,0,0.4)`
                    : undefined,
                }}
              >
                {/* Card header */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="font-display text-[0.62rem] font-bold tracking-[0.28em] uppercase"
                    style={{ color: f.accentColor }}
                  >
                    {f.id} — {f.title}
                  </span>
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-opacity duration-400"
                    style={{ background: f.accentColor, opacity: i === active ? 1 : 0.25 }}
                    aria-hidden="true"
                  />
                </div>

                <h3
                  className="font-display font-semibold text-aura-white mb-2.5 leading-snug"
                  style={{ fontSize: '1.025rem', letterSpacing: '-0.01em' }}
                >
                  {f.headline}
                </h3>
                <p className="font-body text-[0.85rem] text-aura-silver leading-relaxed mb-5">
                  {f.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {f.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-body text-[0.58rem] uppercase tracking-[0.14em] px-2 py-1 border text-aura-muted transition-colors duration-300"
                      style={{
                        borderColor: i === active ? `${f.accentColor}44` : 'rgba(255,255,255,0.07)',
                        color:       i === active ? f.accentColor : undefined,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Click hint on inactive cards */}
                {i !== active && (
                  <p className="mt-4 font-body text-[0.62rem] text-aura-muted tracking-[0.15em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Click to explore →
                  </p>
                )}
              </article>
            ))}
          </div>

          {/* ── Footer row */}
          <div className="mt-8 flex items-center justify-between">
            <p className="font-body text-[0.62rem] text-aura-muted tracking-[0.22em] uppercase">
              Scroll or click to explore · 3D shape morphs with each capability
            </p>
            <span
              className="font-display font-bold text-aura-muted text-[0.68rem] tracking-[0.3em]"
              aria-live="polite"
              aria-label={`Capability ${active + 1} of ${FEATURES.length}`}
            >
              {String(active + 1).padStart(2, '0')} / {String(FEATURES.length).padStart(2, '0')}
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}
