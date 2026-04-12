'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

interface LoadingScreenProps {
  onComplete: () => void
}

/**
 * Polished intro loading animation.
 * Timeline:
 *   0.0s — letters fade + slide in with blur, staggered
 *   0.6s — tagline appears
 *   1.2s — thin progress bar fills (1.2s)
 *   2.4s — brief hold
 *   2.6s — entire screen slides up with clip-path reveal
 *   2.9s — onComplete fires so parent unmounts this component
 */
export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lettersRef   = useRef<HTMLSpanElement[]>([])
  const taglineRef   = useRef<HTMLParagraphElement>(null)
  const progressRef  = useRef<HTMLDivElement>(null)
  const [progress, setProgress]   = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Slide the loader up to reveal the page beneath
          gsap.to(containerRef.current, {
            yPercent: -100,
            duration: 0.85,
            ease: 'power3.inOut',
            onComplete,
          })
        },
      })

      // — Letters reveal
      tl.fromTo(
        lettersRef.current,
        { opacity: 0, y: 28, filter: 'blur(12px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 0.7,
          stagger: 0.09,
          ease: 'power3.out',
        },
        0,
      )

      // — Tagline
      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        0.5,
      )

      // — Progress bar
      tl.to(
        progressRef.current,
        {
          width: '100%',
          duration: 1.4,
          ease: 'power1.inOut',
          onUpdate() {
            const pct = Math.round(gsap.getProperty(progressRef.current, 'width', '%') as number)
            setProgress(pct)
          },
        },
        0.6,
      )

      // — Hold before exit
      tl.to({}, { duration: 0.35 })
    }, containerRef)

    return () => ctx.revert()
  }, [onComplete])

  const letters = 'AURA'.split('')

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-aura-black"
      role="status"
      aria-label="Loading A.U.R.A"
    >
      {/* Ambient glow behind logo */}
      <div
        className="ambient-glow w-[400px] h-[400px] bg-[rgba(120,110,255,0.07)]"
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
      />

      {/* Logo letters */}
      <div className="relative flex items-center gap-[0.06em]" aria-label="AURA">
        {letters.map((letter, i) => (
          <span
            key={i}
            ref={(el) => { if (el) lettersRef.current[i] = el }}
            className="font-display text-aura-white select-none"
            style={{
              fontSize: 'clamp(3.5rem,10vw,7.5rem)',
              fontWeight: 700,
              letterSpacing: '0.28em',
              lineHeight: 1,
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Dot separator between letters for the A.U.R.A style */}
      <div className="mt-2 flex items-center gap-1" aria-hidden="true">
        {['A','U','R','A'].map((_, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.18rem' }}>
            {i < 3 && (
              <span className="w-[3px] h-[3px] rounded-full bg-aura-silver opacity-60" />
            )}
          </span>
        ))}
      </div>

      {/* Tagline */}
      <p
        ref={taglineRef}
        className="mt-6 font-body text-label text-aura-silver tracking-[0.3em] uppercase opacity-0"
      >
        Adaptive Universal Response Assistant
      </p>

      {/* Progress bar */}
      <div className="mt-14 relative w-[220px] h-px bg-[rgba(255,255,255,0.08)] overflow-hidden">
        <div
          ref={progressRef}
          className="absolute left-0 top-0 h-full bg-aura-white"
          style={{ width: '0%' }}
        />
      </div>

      {/* Progress number */}
      <span className="mt-3 font-body text-[0.65rem] text-aura-muted tracking-[0.2em] tabular-nums">
        {progress.toString().padStart(3, '0')}
      </span>
    </div>
  )
}
