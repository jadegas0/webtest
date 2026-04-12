'use client'

/**
 * Full-viewport animated film grain overlay.
 * Pure CSS — no JS overhead.
 * The grain SVG is inlined as a data-URI to avoid an extra HTTP request.
 */
export default function GrainOverlay() {
  return (
    <div
      className="grain"
      aria-hidden="true"
      role="presentation"
    />
  )
}
