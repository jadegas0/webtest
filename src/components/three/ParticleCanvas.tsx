'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import ParticleField from './ParticleField'

interface ParticleCanvasProps {
  scrollState: React.MutableRefObject<{ section: number; featureIdx: number }>
}

/**
 * Full-viewport fixed canvas for the A.U.R.A particle field.
 *
 * z-index & blending strategy:
 *   The canvas sits at z-index 10 (above page backgrounds, below nav at z-50).
 *   `mix-blend-mode: screen` composites particles onto page content additively:
 *     – Transparent canvas pixels → no change to underlying content (alpha = 0)
 *     – Bright particles on dark bg → glow appears (screen = additive on near-black)
 *     – Particles over white text → text stays white (screen of any value with white = white)
 *   Result: particles never obscure text — they only ADD light to dark areas.
 *
 *   `pointer-events: none` ensures all clicks / taps pass through to page content.
 */
export default function ParticleCanvas({ scrollState }: ParticleCanvasProps) {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 10,
        mixBlendMode: 'screen',
        // Isolation prevents parent stacking context from breaking blend mode
        isolation: 'auto',
      }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 48, near: 0.1, far: 80 }}
        gl={{
          antialias: false,
          alpha: true,
          premultipliedAlpha: false, // required for correct screen-blend compositing
          powerPreference: 'high-performance',
          stencil: false,
          depth: false,
        }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
        frameloop="always"
      >
        <ambientLight intensity={0.0} />
        <Suspense fallback={null}>
          <ParticleField scrollState={scrollState} />
        </Suspense>
      </Canvas>
    </div>
  )
}
