'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const STATS = [
  { value: 50,   suffix: 'M+',  label: 'Commands executed daily',    desc: 'Across all connected homes worldwide' },
  { value: 99.9, suffix: '%',   label: 'Uptime guarantee',           desc: 'Enterprise SLA, always available'     },
  { value: 2,    suffix: 'ms',  label: 'Average response latency',   desc: 'Faster than a human thought'          },
  { value: 140,  suffix: '+',   label: 'Integrated services',        desc: 'And growing every quarter'            },
]

const TRUST = [
  'AES-256 Encryption',
  'SOC 2 Type II',
  'GDPR Compliant',
  'Zero-data retention',
  'On-device processing',
]

/**
 * Animated counter that starts at 0 and increments to the target.
 * Uses GSAP for eased animation.
 */
function Counter({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [display, setDisplay] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!inView) return
    if (reduced) { setDisplay(value); return }

    const obj = { n: 0 }
    gsap.to(obj, {
      n: value,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate() { setDisplay(obj.n) },
    })
  }, [inView, value, reduced])

  const formatted = value % 1 === 0
    ? Math.round(display).toLocaleString()
    : display.toFixed(1)

  return (
    <span>
      {formatted}
      <span>{suffix}</span>
    </span>
  )
}

/**
 * Stats section — proof section with animated counters and trust signals.
 */
export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Trigger counters when section enters
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        onEnter: () => setInView(true),
      })

      // Stat items stagger in
      gsap.fromTo(
        '.stat-item',
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        },
      )

      // Trust pills
      gsap.fromTo(
        '.trust-pill',
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.trust-row',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      )

      // Divider line draw
      gsap.fromTo(
        '.stats-divider',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="bg-aura-black py-28 lg:py-40 relative overflow-hidden"
      aria-label="Performance statistics"
    >
      {/* Background subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-20">
          <p className="font-body text-label text-aura-muted uppercase tracking-[0.3em] mb-3">
            By the numbers
          </p>
          <div
            className="stats-divider w-full h-px bg-[rgba(255,255,255,0.08)] origin-left"
            aria-hidden="true"
          />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-14 gap-x-8">
          {STATS.map((stat, i) => (
            <div key={i} className="stat-item" style={{ opacity: reduced ? 1 : 0 }}>
              <div
                className="font-display font-bold text-aura-white tabular-nums"
                style={{ fontSize: 'clamp(2.5rem,4.5vw,5rem)', letterSpacing: '-0.04em', lineHeight: 1 }}
                aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
              >
                <Counter value={stat.value} suffix={stat.suffix} inView={inView} />
              </div>
              <p className="font-body text-[0.8125rem] text-aura-silver mt-3 leading-snug">
                {stat.label}
              </p>
              <p className="font-body text-[0.7rem] text-aura-muted mt-1 leading-snug">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Trust row */}
        <div className="trust-row mt-20 lg:mt-28 pt-10 border-t border-[rgba(255,255,255,0.06)]">
          <p className="font-body text-label text-aura-muted uppercase tracking-[0.3em] mb-6">
            Security & Compliance
          </p>
          <div className="flex flex-wrap gap-3">
            {TRUST.map((item) => (
              <span
                key={item}
                className="trust-pill font-body text-[0.7rem] text-aura-silver border border-[rgba(255,255,255,0.1)] px-4 py-2 tracking-[0.1em] uppercase"
                style={{ opacity: reduced ? 1 : 0 }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <blockquote className="mt-20 lg:mt-28 max-w-[760px]">
          <p
            className="font-display font-semibold text-aura-white leading-[1.3]"
            style={{ fontSize: 'clamp(1.2rem,2vw,2rem)', letterSpacing: '-0.015em' }}
          >
            "A.U.R.A has reclaimed approximately 3 hours of my week. Not in some abstract productivity metric — but three hours I now spend with my family."
          </p>
          <footer className="mt-6">
            <p className="font-body text-sm text-aura-silver">
              — Early Access Member, Series C Founder
            </p>
          </footer>
        </blockquote>
      </div>
    </section>
  )
}
