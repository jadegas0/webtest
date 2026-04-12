'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import ParticleField from './ParticleField'

interface ParticleCanvasProps {
  /**
   * Mutable ref shared with page.tsx.
   * GSAP animates scrollState.current.section (0–5) as the user scrolls.
   * ParticleField reads this ref every frame to decide which shape to morph toward.
   */
  scrollState: React.MutableRefObject<{ section: number }>
}

/**
 * Full-viewport fixed canvas that hosts the A.U.R.A particle field.
 *
 * Design decisions:
 *   — position: fixed so it spans the full viewport regardless of scroll
 *   — pointer-events: none so all clicks pass through to page content
 *   — z-index: 40 (above sections, below navigation at z-50)
 *   — Alpha canvas — black background comes from the page, not the canvas
 *   — DPR capped at 1.5 for performance on high-DPI screens
 *   — antialias: false — point sprites don't benefit from MSAA
 */
export default function ParticleCanvas({ scrollState }: ParticleCanvasProps) {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 40 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 48, near: 0.1, far: 80 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: false,
        }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
        frameloop="always"
      >
        {/* Very minimal lighting — shader handles all glow */}
        <ambientLight intensity={0.0} />

        <Suspense fallback={null}>
          <ParticleField scrollState={scrollState} />
        </Suspense>
      </Canvas>
    </div>
  )
}
