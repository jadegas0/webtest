'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Magnetic button effect — button drifts toward cursor within a radius.
 */
function useMagnetic(ref: React.RefObject<HTMLElement>, strength = 0.35) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx   = rect.left + rect.width  / 2
      const cy   = rect.top  + rect.height / 2
      const dx   = e.clientX - cx
      const dy   = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      const radius = 120

      if (dist < radius) {
        gsap.to(el, {
          x: dx * strength,
          y: dy * strength,
          duration: 0.4,
          ease: 'power2.out',
        })
      }
    }

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' })
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [ref, strength])
}

/**
 * CTA section — fullscreen, dramatic conversion section.
 * Magnetic primary button, email early-access form.
 */
export default function CTA() {
  const sectionRef  = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const formRef     = useRef<HTMLFormElement>(null)
  const btnRef      = useRef<HTMLButtonElement>(null)
  const reduced     = useReducedMotion()

  const [email, setEmail]         = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError]         = useState('')

  // Magnetic button
  useMagnetic(btnRef as React.RefObject<HTMLElement>)

  useEffect(() => {
    if (reduced) return
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Section-wide reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          toggleActions: 'play none none none',
        },
      })

      tl.fromTo(
        '.cta-word',
        { y: '110%' },
        { y: '0%', duration: 0.9, stagger: 0.07, ease: 'power4.out' },
        0,
      )

      tl.fromTo(
        ['.cta-sub', formRef.current],
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out' },
        0.4,
      )

      // Background glow pulse
      gsap.to('.cta-glow', {
        scale: 1.15,
        opacity: 0.18,
        duration: 2.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    // Placeholder submission — wire real backend here
    setSubmitted(true)
    setError('')
  }

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="relative min-h-screen flex flex-col items-center justify-center bg-aura-black overflow-hidden px-6"
      aria-label="Request early access to A.U.R.A"
    >
      {/* Ambient glow */}
      <div
        className="cta-glow ambient-glow w-[700px] h-[700px]"
        style={{
          background: 'radial-gradient(circle, rgba(100,90,220,0.12) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.12,
        }}
        aria-hidden="true"
      />

      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[rgba(255,255,255,0.06)]" aria-hidden="true" />

      <div className="relative z-10 text-center max-w-[900px] mx-auto">
        {/* Eyebrow */}
        <p className="font-body text-label text-aura-muted uppercase tracking-[0.3em] mb-10">
          Early Access
        </p>

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="font-display font-bold text-aura-white mb-8"
          style={{ fontSize: 'clamp(3rem,8vw,9rem)', letterSpacing: '-0.04em', lineHeight: '0.95' }}
          aria-label="Meet A.U.R.A"
        >
          {['Meet', 'A.U.R.A'].map((word) => (
            <span key={word} className="word-clip block">
              <span
                className="cta-word block"
                style={{
                  transform: 'translateY(110%)',
                  ...(word === 'A.U.R.A' ? {
                    background: 'linear-gradient(135deg, #F8F8F8 0%, #9B9B9B 50%, #C4C8D8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  } : {}),
                }}
              >
                {word}
              </span>
            </span>
          ))}
        </h2>

        {/* Sub-copy */}
        <p
          className="cta-sub font-body text-[1.0625rem] text-aura-silver leading-relaxed max-w-[540px] mx-auto mb-14"
          style={{ opacity: reduced ? 1 : 0 }}
        >
          A.U.R.A is in private beta for select households, enterprises, and early adopters. Join the waitlist and be among the first to live with truly ambient intelligence.
        </p>

        {/* Form / Success */}
        {submitted ? (
          <div className="flex flex-col items-center gap-4" role="status" aria-live="polite">
            <div className="w-12 h-12 rounded-full border border-[rgba(120,200,160,0.5)] flex items-center justify-center">
              <span className="text-[#78C8A0] text-xl" aria-hidden="true">✓</span>
            </div>
            <p className="font-display font-semibold text-aura-white text-lg">
              You're on the list.
            </p>
            <p className="font-body text-sm text-aura-silver">
              We'll be in touch when your access is ready.
            </p>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-stretch gap-3 max-w-[480px] mx-auto"
            style={{ opacity: reduced ? 1 : 0 }}
            aria-label="Email waitlist form"
            noValidate
          >
            <div className="flex-1">
              <label htmlFor="cta-email" className="sr-only">Email address</label>
              <input
                id="cta-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                placeholder="your@email.com"
                required
                className="w-full h-full px-5 py-4 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-aura-white placeholder-aura-muted font-body text-sm focus:outline-none focus:border-[rgba(255,255,255,0.35)] transition-colors duration-300"
                aria-describedby={error ? 'cta-error' : undefined}
                style={{ cursor: 'auto' }}
              />
            </div>
            <button
              ref={btnRef}
              type="submit"
              className="btn-primary flex-shrink-0 whitespace-nowrap"
              style={{ cursor: 'none' }}
            >
              <span>Request Access</span>
            </button>
          </form>
        )}

        {/* Error */}
        {error && (
          <p id="cta-error" className="mt-3 font-body text-sm text-[#E0899A]" role="alert">
            {error}
          </p>
        )}

        {/* Small print */}
        {!submitted && (
          <p className="mt-6 font-body text-[0.7rem] text-aura-muted">
            No spam. No sharing. Unsubscribe anytime.
          </p>
        )}

        {/* Contact grid */}
        <div className="mt-16 pt-10 border-t border-[rgba(255,255,255,0.06)] grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-[680px] mx-auto">
          <div>
            <p className="font-body text-label text-aura-muted uppercase tracking-[0.2em] mb-2">Investors</p>
            <a
              href="mailto:invest@aura.ai"
              className="font-body text-sm text-aura-silver hover:text-aura-white transition-colors duration-300"
              style={{ cursor: 'none' }}
            >
              invest@aura.ai
            </a>
            <p className="font-body text-[0.68rem] text-aura-muted mt-1">
              Deck available on request
            </p>
          </div>
          <div>
            <p className="font-body text-label text-aura-muted uppercase tracking-[0.2em] mb-2">Enterprise</p>
            <a
              href="mailto:enterprise@aura.ai"
              className="font-body text-sm text-aura-silver hover:text-aura-white transition-colors duration-300"
              style={{ cursor: 'none' }}
            >
              enterprise@aura.ai
            </a>
            <p className="font-body text-[0.68rem] text-aura-muted mt-1">
              Custom deployment &amp; SLA
            </p>
          </div>
          <div>
            <p className="font-body text-label text-aura-muted uppercase tracking-[0.2em] mb-2">Press</p>
            <a
              href="mailto:press@aura.ai"
              className="font-body text-sm text-aura-silver hover:text-aura-white transition-colors duration-300"
              style={{ cursor: 'none' }}
            >
              press@aura.ai
            </a>
            <p className="font-body text-[0.68rem] text-aura-muted mt-1">
              Media kit &amp; spokesperson
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
