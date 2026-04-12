'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { AuraOrb } from './AuraOrb'

/**
 * Three.js canvas that hosts the A.U.R.A hero orb.
 * Rendered client-side only (no SSR) via next/dynamic.
 * The canvas is transparent — the dark background comes from the parent section.
 */
export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 45, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        // Tone mapping for realistic HDR look
        toneMapping: 4, // THREE.ACESFilmicToneMapping
        toneMappingExposure: 1.1,
      }}
      dpr={[1, 1.5]} // cap pixel ratio for performance
      style={{ background: 'transparent' }}
      aria-hidden="true"
    >
      {/* Ambient fill — very dark */}
      <ambientLight intensity={0.08} color="#101018" />

      {/* Key light — upper-right cool white */}
      <directionalLight
        position={[3, 4, 3]}
        intensity={1.8}
        color="#D0D8FF"
      />

      {/* Fill light — warm counter-side */}
      <pointLight
        position={[-4, -2, -3]}
        intensity={0.6}
        color="#FFE8C0"
        distance={12}
      />

      {/* Rim light — strong back edge */}
      <pointLight
        position={[0, 0, -5]}
        intensity={0.9}
        color="#8090FF"
        distance={10}
      />

      <Suspense fallback={null}>
        <AuraOrb />
      </Suspense>
    </Canvas>
  )
}
