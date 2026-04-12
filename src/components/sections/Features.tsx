'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Each feature has its own full-screen section with a unique background.
 * headline is split into lines for per-line reveal animation.
 * bg is a multi-layer radial-gradient composited over aura-black.
 * bgAccent is a secondary glow that parallaxes at a different rate.
 */
const FEATURES = [
  {
    id: '01',
    title: 'Smart Ordering',
    headline: ['Your pantry,', 'always full.'],
    description:
      'A.U.R.A learns your household preferences and reorder cadence, placing grocery and essentials orders before you run out — automatically, or with a single confirmation.',
    tags: ['Groceries', 'Pharmacy', 'Household'],
    accentColor: '#C4A87A',
    // Warm amber — kitchen, abundance, warmth
    bg: `
      radial-gradient(ellipse at 18% 78%, rgba(196,168,122,0.26) 0%, transparent 62%),
      radial-gradient(ellipse at 82% 22%, rgba(220,185,110,0.14) 0%, transparent 55%)
    `,
    bgAccent: `radial-gradient(ellipse at 55% 60%, rgba(240,200,130,0.08) 0%, transparent 50%)`,
  },
  {
    id: '02',
    title: 'Travel & Dining',
    headline: ['Every experience,', 'curated.'],
    description:
      'From Michelin-starred reservations to last-minute flights and hotel upgrades — A.U.R.A handles the logistics so you can focus on living. Preferences remembered, every time.',
    tags: ['Flights', 'Hotels', 'Restaurants'],
    accentColor: '#7B9FFF',
    // Deep blue-indigo — open sky, travel, altitude
    bg: `
      radial-gradient(ellipse at 72% 18%, rgba(80,120,240,0.24) 0%, transparent 60%),
      radial-gradient(ellipse at 22% 80%, rgba(50,80,200,0.14) 0%, transparent 55%)
    `,
    bgAccent: `radial-gradient(ellipse at 45% 35%, rgba(100,150,255,0.08) 0%, transparent 50%)`,
  },
  {
    id: '03',
    title: 'Deep Research',
    headline: ['Information distilled', 'to signal.'],
    description:
      'Ask anything complex. A.U.R.A synthesises across thousands of sources, validates claims, and delivers a clear, cited brief — market data, medical literature, or legal precedent.',
    tags: ['Market Intel', 'Academic', 'Legal'],
    accentColor: '#A590F0',
    // Violet-purple — intelligence, depth, analysis
    bg: `
      radial-gradient(ellipse at 50% 42%, rgba(130,90,230,0.26) 0%, transparent 60%),
      radial-gradient(ellipse at 15% 75%, rgba(80,55,200,0.14) 0%, transparent 52%)
    `,
    bgAccent: `radial-gradient(ellipse at 75% 70%, rgba(160,110,240,0.08) 0%, transparent 50%)`,
  },
  {
    id: '04',
    title: 'Smart Home',
    headline: ['Your space,', 'perfectly tuned.'],
    description:
      'Climate, lighting, security, entertainment — A.U.R.A orchestrates every connected device around your routines, presence, and mood. Arrive home to exactly the environment you want.',
    tags: ['Climate', 'Security', 'Lighting'],
    accentColor: '#E0899A',
    // Warm copper-rose — living space, hearth, comfort
    bg: `
      radial-gradient(ellipse at 28% 65%, rgba(210,120,90,0.24) 0%, transparent 60%),
      radial-gradient(ellipse at 78% 28%, rgba(230,100,100,0.14) 0%, transparent 55%)
    `,
    bgAccent: `radial-gradient(ellipse at 50% 80%, rgba(200,140,110,0.08) 0%, transparent 50%)`,
  },
  {
    id: '05',
    title: 'Finance & Admin',
    headline: ['Your financial', 'co-pilot.'],
    description:
      'Bill payments, subscription management, expense tracking, and investment briefings — all monitored and actioned on your behalf, with full auditability and control.',
    tags: ['Payments', 'Investments', 'Expenses'],
    accentColor: '#78C8A0',
    // Emerald-teal — growth, precision, trust
    bg: `
      radial-gradient(ellipse at 68% 48%, rgba(50,180,140,0.24) 0%, transparent 60%),
      radial-gradient(ellipse at 18% 28%, rgba(30,160,110,0.14) 0%, transparent 52%)
    `,
    bgAccent: `radial-gradient(ellipse at 35% 70%, rgba(60,200,150,0.08) 0%, transparent 50%)`,
  },
  {
    id: '06',
    title: 'Health & Wellness',
    headline: ['Proactive,', 'not reactive.'],
    description:
      'A.U.R.A monitors health data, schedules appointments, manages prescriptions, and nudges you toward balance — working quietly in the background of a well-lived life.',
    tags: ['Medical', 'Fitness', 'Sleep'],
    accentColor: '#D4A8FF',
    // Soft rose-lavender — vitality, care, calm
    bg: `
      radial-gradient(ellipse at 38% 58%, rgba(200,110,180,0.24) 0%, transparent 60%),
      radial-gradient(ellipse at 78% 22%, rgba(180,120,230,0.14) 0%, transparent 55%)
    `,
    bgAccent: `radial-gradient(ellipse at 60% 80%, rgba(210,140,220,0.08) 0%, transparent 50%)`,
  },
]

interface FeaturesProps {
  onFeatureChange?: (idx: number) => void
}

/**
 * Features section — six full-viewport subsections, each with its own
 * parallax background, large typographic headline, and scroll-driven reveal.
 *
 * Architecture:
 *  — No sticky panel. Each sub-section is 100vh, stacked vertically.
 *  — Two background layers per section parallax at different speeds:
 *      primary bg  → translateY -20% to +20% (slow, feels far away)
 *      accent glow → translateY -10% to +10% (mid-speed)
 *  — Headline lines clip-reveal upward on enter.
 *  — ScrollTrigger enter/enterBack fires onFeatureChange for particle morph.
 */
export default function Features({ onFeatureChange }: FeaturesProps) {
  const wrapperRef  = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const bgRefs      = useRef<(HTMLDivElement | null)[]>([])
  const bgAccRefs   = useRef<(HTMLDivElement | null)[]>([])
  const reduced     = useReducedMotion()

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      sectionRefs.current.forEach((section, i) => {
        if (!section) return

        const bg    = bgRefs.current[i]
        const bgAcc = bgAccRefs.current[i]

        // ── Parallax layers — move at different rates, creating depth
        if (!reduced) {
          if (bg) {
            gsap.fromTo(
              bg,
              { y: '-22%' },
              {
                y: '22%',
                ease: 'none',
                scrollTrigger: {
                  trigger: section,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                },
              },
            )
          }
          if (bgAcc) {
            gsap.fromTo(
              bgAcc,
              { y: '-10%' },
              {
                y: '10%',
                ease: 'none',
                scrollTrigger: {
                  trigger: section,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                },
              },
            )
          }

          // ── Headline lines: clip-reveal upward from below
          const words = section.querySelectorAll<HTMLElement>('.feat-word')
          if (words.length) {
            gsap.fromTo(
              words,
              { y: '112%' },
              {
                y: '0%',
                stagger: 0.09,
                duration: 1.0,
                ease: 'power4.out',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 72%',
                  toggleActions: 'play none none none',
                },
              },
            )
          }

          // ── Eyebrow, description, tags: fade + slide up
          const meta = section.querySelectorAll<HTMLElement>('.feat-meta')
          if (meta.length) {
            gsap.fromTo(
              meta,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                stagger: 0.1,
                duration: 0.85,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 68%',
                  toggleActions: 'play none none none',
                },
              },
            )
          }

          // ── Accent line: draw from left
          const line = section.querySelector<HTMLElement>('.feat-line')
          if (line) {
            gsap.fromTo(
              line,
              { scaleX: 0 },
              {
                scaleX: 1,
                duration: 1.1,
                ease: 'power3.inOut',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 72%',
                  toggleActions: 'play none none none',
                },
              },
            )
          }

          // ── Decorative number: fade in slowly
          const num = section.querySelector<HTMLElement>('.feat-num')
          if (num) {
            gsap.fromTo(
              num,
              { opacity: 0 },
              {
                opacity: 0.055,
                duration: 1.4,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 65%',
                  toggleActions: 'play none none none',
                },
              },
            )
          }
        }

        // ── Notify parent to morph particles to matching icon shape
        ScrollTrigger.create({
          trigger: section,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter:     () => onFeatureChange?.(i),
          onEnterBack: () => onFeatureChange?.(i),
        })
      })
    }, wrapperRef)

    return () => ctx.revert()
  }, [reduced, onFeatureChange])

  return (
    <div ref={wrapperRef} id="features" aria-label="A.U.R.A capabilities">

      {/* ── Section intro banner ──────────────────────────────────────── */}
      <div className="bg-aura-black relative py-24 lg:py-32 overflow-hidden border-b border-[rgba(255,255,255,0.06)]">
        {/* Subtle background noise */}
        <div
          className="absolute inset-0 opacity-[0.018] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '72px 72px',
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
          <p className="font-body text-label text-aura-muted uppercase tracking-[0.32em] mb-6">
            Capabilities
          </p>
          <h2
            className="font-display font-bold text-aura-white"
            style={{
              fontSize: 'clamp(2.6rem,5vw,6rem)',
              letterSpacing: '-0.03em',
              lineHeight: 1.02,
              maxWidth: '820px',
            }}
          >
            Everything You Need.{' '}
            <span
              style={{
                background: 'linear-gradient(118deg, #C4C8D8 0%, #F8F8F8 55%, #9B9B9B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Nothing You Don&apos;t.
            </span>
          </h2>
          <p className="font-body text-[1rem] text-aura-silver mt-7 max-w-[480px] leading-relaxed opacity-70">
            Six domains. One intelligence. Scroll through each to see A.U.R.A in action.
          </p>
          {/* Scroll cue */}
          <div className="flex items-center gap-3 mt-10" aria-hidden="true">
            <div className="w-px h-10 bg-[rgba(255,255,255,0.14)]" />
            <p className="font-body text-[0.65rem] uppercase tracking-[0.28em] text-aura-muted">
              Scroll to explore
            </p>
          </div>
        </div>
      </div>

      {/* ── Feature subsections ───────────────────────────────────────── */}
      {FEATURES.map((f, i) => (
        <section
          key={f.id}
          ref={el => { sectionRefs.current[i] = el }}
          className="relative bg-aura-black overflow-hidden"
          style={{ height: '100vh' }}
          aria-label={`${f.title} — ${f.headline.join(' ')}`}
        >
          {/* Primary parallax glow (moves -22% → +22%) */}
          <div
            ref={el => { bgRefs.current[i] = el }}
            className="absolute pointer-events-none will-change-transform"
            style={{ inset: '-25% 0', background: f.bg }}
            aria-hidden="true"
          />

          {/* Secondary accent glow (moves at different rate) */}
          <div
            ref={el => { bgAccRefs.current[i] = el }}
            className="absolute pointer-events-none will-change-transform"
            style={{ inset: '-15% 0', background: f.bgAccent }}
            aria-hidden="true"
          />

          {/* Dot grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)',
              backgroundSize: '52px 52px',
              opacity: 0.028,
            }}
            aria-hidden="true"
          />

          {/* Top separator */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent 0%, ${f.accentColor}44 30%, ${f.accentColor}44 70%, transparent 100%)` }}
            aria-hidden="true"
          />

          {/* Decorative large number — bottom-right */}
          <div
            className="feat-num absolute right-6 lg:right-14 bottom-6 lg:bottom-10 font-display font-bold select-none pointer-events-none"
            style={{
              fontSize: 'clamp(10rem,24vw,32rem)',
              lineHeight: 0.8,
              letterSpacing: '-0.06em',
              color: f.accentColor,
              opacity: 0,              // GSAP fades this in
            }}
            aria-hidden="true"
          >
            {f.id}
          </div>

          {/* Vertical index line — left edge */}
          <div
            className="absolute left-0 top-0 bottom-0 w-px"
            style={{ background: `linear-gradient(180deg, transparent 0%, ${f.accentColor}30 30%, ${f.accentColor}30 70%, transparent 100%)` }}
            aria-hidden="true"
          />

          {/* ── Content ────────────────────────────────────────────── */}
          <div className="relative z-10 h-full flex items-center">
            <div className="mx-auto max-w-[1400px] px-8 lg:px-16 w-full">

              {/* Eyebrow row */}
              <div className="feat-meta flex items-center gap-5 mb-10" style={{ opacity: 0 }}>
                <div
                  className="feat-line h-px w-14 origin-left flex-shrink-0"
                  style={{
                    background: f.accentColor,
                    transformOrigin: 'left center',
                  }}
                  aria-hidden="true"
                />
                <span
                  className="font-body text-[0.68rem] uppercase tracking-[0.32em]"
                  style={{ color: f.accentColor }}
                >
                  {f.id} — {f.title}
                </span>
              </div>

              {/* Headline — each line clips upward */}
              <h3
                className="font-display font-bold text-aura-white mb-10 lg:mb-12"
                style={{
                  fontSize: 'clamp(3.2rem,7.5vw,9.5rem)',
                  letterSpacing: '-0.04em',
                  lineHeight: '0.93',
                  maxWidth: '820px',
                }}
              >
                {f.headline.map((line, li) => (
                  <span
                    key={li}
                    className="block"
                    style={{ overflow: 'hidden' }}
                  >
                    <span
                      className="feat-word block"
                      style={{ transform: reduced ? 'none' : 'translateY(112%)' }}
                    >
                      {li === f.headline.length - 1 ? (
                        <span
                          style={{
                            background: `linear-gradient(118deg, #F8F8F8 0%, ${f.accentColor} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}
                        >
                          {line}
                        </span>
                      ) : line}
                    </span>
                  </span>
                ))}
              </h3>

              {/* Description */}
              <p
                className="feat-meta font-body text-[1rem] lg:text-[1.125rem] text-aura-silver leading-relaxed max-w-[520px] mb-9"
                style={{ opacity: 0 }}
              >
                {f.description}
              </p>

              {/* Tags */}
              <div className="feat-meta flex flex-wrap gap-2.5" style={{ opacity: 0 }}>
                {f.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-body text-[0.68rem] uppercase tracking-[0.2em] px-4 py-2"
                    style={{
                      border: `1px solid ${f.accentColor}55`,
                      color: f.accentColor,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

            </div>
          </div>

          {/* Counter — bottom left */}
          <div
            className="absolute bottom-8 left-8 lg:left-16 flex items-center gap-3"
            aria-hidden="true"
          >
            <span
              className="font-display font-bold tabular-nums"
              style={{ fontSize: 'clamp(0.6rem,0.9vw,0.75rem)', letterSpacing: '0.22em', color: f.accentColor, opacity: 0.7 }}
            >
              {f.id}
            </span>
            <span
              className="font-display tabular-nums text-aura-muted"
              style={{ fontSize: 'clamp(0.6rem,0.9vw,0.75rem)', letterSpacing: '0.22em' }}
            >
              / {String(FEATURES.length).padStart(2, '0')}
            </span>
          </div>

        </section>
      ))}
    </div>
  )
}
