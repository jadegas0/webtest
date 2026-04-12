'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const MARQUEE_ITEMS = [
  'Groceries', 'Restaurant Booking', 'Flight Tickets',
  'Research', 'Smart Home', 'Health & Wellness',
  'Finance', 'Travel Planning', 'Entertainment',
  'Groceries', 'Restaurant Booking', 'Flight Tickets',
  'Research', 'Smart Home', 'Health & Wellness',
  'Finance', 'Travel Planning', 'Entertainment',
]

/**
 * Brand manifesto section.
 * Dark-to-light contrast break — stays dark, but typography breathes more.
 *
 * Animations:
 *   — Statement headline reveals word-by-word
 *   — Sub copy fades + translates up
 *   — Marquee loops continuously
 *   — Section has a subtle pin before continuing
 */
export default function Brand() {
  const sectionRef   = useRef<HTMLElement>(null)
  const statementRef = useRef<HTMLHeadingElement>(null)
  const subRef       = useRef<HTMLDivElement>(null)
  const reduced      = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Headline word reveal
      const words = statementRef.current?.querySelectorAll('.brand-word') ?? []
      gsap.fromTo(
        words,
        { y: '110%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 0.9,
          stagger: 0.055,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: statementRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        },
      )

      // Sub-copy
      gsap.fromTo(
        subRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: subRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        },
      )

      // Divider line draw
      gsap.fromTo(
        '.brand-line',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  // Split "Intelligence, Woven Into Living." into word spans
  const headline = 'Intelligence. Woven Into Living.'
  const words    = headline.split(' ')

  return (
    <section
      ref={sectionRef}
      id="brand"
      className="relative bg-aura-black overflow-hidden py-28 lg:py-40"
      aria-label="Brand manifesto"
    >
      {/* Top border line */}
      <div
        className="brand-line absolute top-0 left-12 right-12 h-px bg-[rgba(255,255,255,0.08)] origin-left"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Eyebrow */}
        <p className="font-body text-label text-aura-muted uppercase tracking-[0.3em] mb-10">
          Our Belief
        </p>

        {/* Statement headline */}
        <h2
          ref={statementRef}
          className="font-display font-bold overflow-hidden"
          style={{
            fontSize: 'clamp(2.8rem,5.5vw,6.5rem)',
            lineHeight: '1.05',
            letterSpacing: '-0.03em',
            maxWidth: '900px',
          }}
          aria-label={headline}
        >
          {words.map((word, i) => (
            <span key={i} className="word-clip" style={{ marginRight: '0.22em' }}>
              <span
                className="brand-word"
                style={{
                  display: 'inline-block',
                  // Chrome gradient on "Living."
                  ...(word === 'Living.' ? {
                    background: 'linear-gradient(120deg, #C4C8D8 0%, #F8F8F8 50%, #9B9B9B 100%)',
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

        {/* Sub-copy + stat inline */}
        <div
          ref={subRef}
          className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-[1fr_auto] items-end gap-10 lg:gap-24"
          style={{ opacity: reduced ? 1 : 0 }}
        >
          <p className="font-body text-[1.0625rem] text-aura-silver leading-[1.75] max-w-[560px]">
            A.U.R.A isn't another app. It's a new layer of intelligence woven into your daily life —
            proactive, private, and always learning. From the moment you wake to the moment you sleep,
            every small friction is handled before you notice it exists.
          </p>
          <div className="flex-shrink-0 text-right lg:text-left">
            <p className="font-display font-bold text-aura-white leading-none" style={{ fontSize: 'clamp(2.5rem,4vw,4.5rem)', letterSpacing: '-0.03em' }}>
              100+
            </p>
            <p className="font-body text-label text-aura-muted uppercase tracking-[0.2em] mt-2">
              Integrations
            </p>
          </div>
        </div>
      </div>

      {/* Marquee — capability strip */}
      <div
        className="mt-24 lg:mt-32 overflow-hidden border-y border-[rgba(255,255,255,0.06)] py-5"
        aria-label="A.U.R.A capabilities"
      >
        <div className="marquee-track">
          {MARQUEE_ITEMS.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-8 px-8 flex-shrink-0"
            >
              <span className="font-display font-semibold text-aura-silver uppercase tracking-[0.15em]" style={{ fontSize: '0.8125rem' }}>
                {item}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[rgba(255,255,255,0.18)] flex-shrink-0" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
