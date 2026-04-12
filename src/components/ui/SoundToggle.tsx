'use client'

import { useState, useCallback } from 'react'

/**
 * Sound toggle button — muted by default.
 * Accessible, keyboard-navigable.
 * No audio is actually wired (placeholder) — the toggle persists state
 * for when real audio is integrated.
 */
export default function SoundToggle() {
  const [muted, setMuted] = useState(true)

  const toggle = useCallback(() => {
    setMuted((prev) => !prev)
    // Wire real audio context here when integrating sound design
  }, [])

  return (
    <button
      onClick={toggle}
      aria-label={muted ? 'Unmute ambient sound' : 'Mute ambient sound'}
      aria-pressed={!muted}
      className="flex items-center gap-2 text-label text-aura-muted hover:text-aura-silver transition-colors duration-300 uppercase tracking-[0.18em]"
      style={{ cursor: 'none' }}
    >
      {/* Sound wave bars */}
      <span className="flex items-end gap-[2px] h-3" aria-hidden="true">
        {[0.4, 0.9, 0.6, 1, 0.7].map((h, i) => (
          <span
            key={i}
            className="w-[2px] bg-current rounded-full transition-all duration-300"
            style={{
              height: `${h * 100}%`,
              opacity: muted ? (i === 0 ? 1 : 0.18) : 1,
              transform: muted ? 'scaleY(0.5)' : 'scaleY(1)',
              transitionDelay: `${i * 40}ms`,
            }}
          />
        ))}
      </span>
      <span className="hidden sm:block">{muted ? 'Sound off' : 'Sound on'}</span>
    </button>
  )
}
