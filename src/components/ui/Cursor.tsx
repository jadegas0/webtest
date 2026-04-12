'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Custom dual-ring cursor:
 *   — Inner dot follows instantly
 *   — Outer ring follows with spring lag (lerp via GSAP ticker)
 *   — On hover of links/buttons: outer ring scales up, inner dot hides
 *   — On click: brief scale-down pulse
 */
export default function Cursor() {
  const dotRef   = useRef<HTMLDivElement>(null)
  const ringRef  = useRef<HTMLDivElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const ringPos  = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // Hide until first mouse move
    gsap.set([dot, ring], { opacity: 0 })

    let visible = false

    const onMove = (e: MouseEvent) => {
      if (!visible) {
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 })
        visible = true
      }
      mousePos.current = { x: e.clientX, y: e.clientY }
      // Inner dot snaps immediately
      gsap.set(dot, { x: e.clientX, y: e.clientY })
    }

    const onLeave = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 })
      visible = false
    }

    const onDown  = () => gsap.to(ring, { scale: 0.7, duration: 0.15, ease: 'power2.out' })
    const onUp    = () => gsap.to(ring, { scale: 1,   duration: 0.35, ease: 'elastic.out(1,0.5)' })

    // Hover state — detect interactive elements
    const interactive = 'a, button, [role="button"], input, [data-cursor-hover]'
    let hovered = false

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest(interactive)) {
        if (!hovered) {
          hovered = true
          gsap.to(ring, { scale: 1.8, borderColor: 'rgba(255,255,255,0.5)', duration: 0.35, ease: 'power2.out' })
          gsap.to(dot,  { scale: 0,   duration: 0.2 })
        }
      } else if (hovered) {
        hovered = false
        gsap.to(ring, { scale: 1,   borderColor: 'rgba(255,255,255,0.55)', duration: 0.35, ease: 'power2.out' })
        gsap.to(dot,  { scale: 1,   duration: 0.2 })
      }
    }

    document.addEventListener('mousemove',  onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mousedown',  onDown)
    document.addEventListener('mouseup',    onUp)
    document.addEventListener('mouseover',  onOver)

    // Outer ring lerps toward mouse
    const ticker = gsap.ticker.add(() => {
      const dx = mousePos.current.x - ringPos.current.x
      const dy = mousePos.current.y - ringPos.current.y
      ringPos.current.x += dx * 0.12
      ringPos.current.y += dy * 0.12
      gsap.set(ring, { x: ringPos.current.x, y: ringPos.current.y })
    })

    return () => {
      document.removeEventListener('mousemove',  onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mousedown',  onDown)
      document.removeEventListener('mouseup',    onUp)
      document.removeEventListener('mouseover',  onOver)
      gsap.ticker.remove(ticker)
    }
  }, [])

  return (
    <>
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="custom-cursor pointer-events-none fixed z-[10000] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.55)',
          mixBlendMode: 'difference',
        }}
        aria-hidden="true"
      />
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="custom-cursor pointer-events-none fixed z-[10000] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.9)',
          mixBlendMode: 'difference',
        }}
        aria-hidden="true"
      />
    </>
  )
}
