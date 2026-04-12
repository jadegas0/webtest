'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Marquee duplicated so the loop is seamless at any viewport width
const MARQUEE_ITEMS = [
  'Grocery Ordering', 'Restaurant Booking', 'Flight Tickets',
  'Deep Research', 'Smart Home Control', 'Health & Wellness',
  'Finance & Bills', 'Travel Planning', 'Entertainment',
  'Pharmacy Orders', 'Calendar Management', 'Home Security',
  'Grocery Ordering', 'Restaurant Booking', 'Flight Tickets',
  'Deep Research', 'Smart Home Control', 'Health & Wellness',
  'Finance & Bills', 'Travel Planning', 'Entertainment',
  'Pharmacy Orders', 'Calendar Management', 'Home Security',
]

const INTEGRATION_CATEGORIES = [
  { label: 'Commerce',    examples: 'Amazon · Instacart · Uber Eats' },
  { label: 'Travel',      examples: 'Flights · Hotels · Uber · Rail'  },
  { label: 'Smart Home',  examples: 'Matter · HomeKit · Google Home'  },
  { label: 'Productivity',examples: 'Calendar · Email · Docs · Slack'  },
]

/**
 * Brand manifesto section.
 *
 * Animations:
 *   — Headline reveals word-by-word (clip from below)
 *   — Sub-copy + integration grid fade up on scroll
 *   — Top border line draws from left on scroll entry
 *   — Marquee loops indefinitely (CSS animation, zero JS)
 */
export default function Brand() {
  const sectionRef   = useRef<HTMLElement>(null)
  const statementRef = useRef<HTMLHeadingElement>(null)
  const subRef       = useRef<HTMLDivElement>(null)
  const gridRef      = useRef<HTMLDivElement>(null)
  const reduced      = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Line draw
      gsap.fromTo('.brand-line', { scaleX: 0 }, {
        scaleX: 1, duration: 1.3, ease: 'power3.inOut',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
      })

      // Headline words
      const words = statementRef.current?.querySelectorAll('.brand-word') ?? []
      gsap.fromTo(words,
        { y: '110%', opacity: 0 },
        {
          y: '0%', opacity: 1, duration: 0.88, stagger: 0.055, ease: 'power4.out',
          scrollTrigger: { trigger: statementRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        },
      )

      // Sub-copy
      gsap.fromTo(subRef.current,
        { opacity: 0, y: 26 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: subRef.current, start: 'top 82%', toggleActions: 'play none none none' },
        },
      )

      // Integration grid cells stagger
      gsap.fromTo('.integration-cell',
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0, stagger: 0.08, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  // Split headline into word spans for per-word reveal
  const headline = 'Intelligence. Woven Into Living.'
  const words    = headline.split(' ')

  return (
    <section
      ref={sectionRef}
      id="brand"
      className="relative bg-aura-black overflow-hidden py-28 lg:py-44"
      aria-labelledby="brand-headline"
    >
      {/* Top border — draws on scroll entry */}
      <div
        className="brand-line absolute top-0 left-0 right-0 h-px bg-[rgba(255,255,255,0.07)] origin-left"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Eyebrow */}
        <p className="font-body text-label text-aura-muted uppercase tracking-[0.32em] mb-10">
          Our Belief
        </p>

        {/* Manifesto headline */}
        <h2
          id="brand-headline"
          ref={statementRef}
          className="font-display font-bold"
          style={{
            fontSize: 'clamp(2.6rem,5.2vw,6.2rem)',
            lineHeight: '1.06',
            letterSpacing: '-0.03em',
            maxWidth: '920px',
          }}
          aria-label={headline}
        >
          {words.map((word, i) => (
            <span key={i} className="word-clip" style={{ marginRight: '0.2em', display: 'inline-block' }}>
              <span
                className="brand-word"
                style={{
                  display: 'inline-block',
                  ...(word === 'Living.' ? {
                    background: 'linear-gradient(118deg, #C4C8D8 0%, #F8F8F8 48%, #9B9B9B 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  } : { color: '#F8F8F8' }),
                }}
              >
                {word}
              </span>
            </span>
          ))}
        </h2>

        {/* Sub-copy */}
        <div
          ref={subRef}
          className="mt-12 lg:mt-16 max-w-[580px]"
          style={{ opacity: reduced ? 1 : 0 }}
        >
          <p className="font-body text-[1.05rem] text-aura-silver leading-[1.8]">
            A.U.R.A is not another app you manage. It&apos;s a layer of intelligence that runs beneath
            your day — proactive, private, and always learning. From the moment you wake to the moment
            you sleep, every small friction is handled before you notice it exists.
          </p>
          <p className="font-body text-[1.05rem] text-aura-silver leading-[1.8] mt-5">
            One voice. Every domain. Completely yours.
          </p>
        </div>

        {/* Integration categories */}
        <div
          ref={gridRef}
          className="mt-16 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 pt-10 border-t border-[rgba(255,255,255,0.06)]"
        >
          {INTEGRATION_CATEGORIES.map((cat) => (
            <div key={cat.label} className="integration-cell" style={{ opacity: reduced ? 1 : 0 }}>
              <p className="font-display text-label font-semibold text-aura-white uppercase tracking-[0.18em] mb-2">
                {cat.label}
              </p>
              <p className="font-body text-[0.78rem] text-aura-muted leading-relaxed">
                {cat.examples}
              </p>
            </div>
          ))}
          {/* Stat cell */}
          <div
            className="integration-cell lg:col-span-4 flex items-end justify-between pt-8 border-t border-[rgba(255,255,255,0.05)] mt-2"
            style={{ opacity: reduced ? 1 : 0 }}
          >
            <p className="font-body text-[0.78rem] text-aura-muted max-w-[360px]">
              New integrations ship every quarter. Enterprise customers get priority access and custom connectors.
            </p>
            <div className="text-right flex-shrink-0">
              <p
                className="font-display font-bold text-aura-white leading-none"
                style={{ fontSize: 'clamp(2rem,3.5vw,4rem)', letterSpacing: '-0.03em' }}
              >
                140+
              </p>
              <p className="font-body text-label text-aura-muted uppercase tracking-[0.2em] mt-1.5">
                Integrations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling marquee */}
      <div
        className="mt-20 lg:mt-28 overflow-hidden border-y border-[rgba(255,255,255,0.06)] py-5"
        aria-label="A.U.R.A capability domains"
      >
        <div className="marquee-track" aria-hidden="true">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="flex items-center gap-7 px-7 flex-shrink-0">
              <span
                className="font-display font-medium text-aura-silver uppercase tracking-[0.16em]"
                style={{ fontSize: '0.79rem' }}
              >
                {item}
              </span>
              <span className="w-[5px] h-[5px] rounded-full bg-[rgba(255,255,255,0.14)] flex-shrink-0" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
