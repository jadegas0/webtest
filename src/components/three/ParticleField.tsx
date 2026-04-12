'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { PARTICLE_COUNT, SHAPES, SECTION_CONFIG } from './shapes'

// ─── Vertex shader ────────────────────────────────────────────────────
// Positions come from CPU-side lerped buffer (updated via needsUpdate).
// Per-particle size + color attributes let us vary appearance.
// Subtle time-driven wobble adds life without CPU overhead.
const vertexShader = /* glsl */`
attribute float aSize;
attribute vec3  aColor;

varying vec3  vColor;
varying float vAlpha;

uniform float uTime;
uniform float uPixelRatio;
uniform float uGlobalOpacity;

void main() {
  vColor = aColor;

  // Micro-wobble: each particle oscillates slightly based on its index
  vec3 pos = position;
  float wave = sin(pos.x * 1.8 + uTime * 0.9) * 0.018
             + cos(pos.y * 2.1 + uTime * 0.7) * 0.012
             + sin(pos.z * 1.5 + uTime * 0.6) * 0.010;
  pos += wave;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  float depth = -mvPosition.z;

  // Depth-based alpha — particles far away fade out
  vAlpha = smoothstep(12.0, 1.5, depth) * uGlobalOpacity;

  // Size attenuation: larger when close, tiny when far
  gl_PointSize = aSize * (uPixelRatio * 160.0) / max(depth, 0.1);
  gl_Position  = projectionMatrix * mvPosition;
}
`

// ─── Fragment shader ──────────────────────────────────────────────────
// Each particle is a soft circular glow with a bright white core.
// Additive blending (set on the material) makes overlapping particles
// naturally accumulate brightness — no extra post-processing needed.
const fragmentShader = /* glsl */`
varying vec3  vColor;
varying float vAlpha;

void main() {
  // UV relative to point center (0,0 = center, ±0.5 = edge)
  vec2 uv   = gl_PointCoord - 0.5;
  float d   = length(uv);

  // Hard clip at radius 0.5
  if (d > 0.5) discard;

  // Outer soft glow
  float glow = exp(-d * 7.0);

  // Bright inner core (much tighter)
  float core = exp(-d * 28.0);

  // Combine: glow forms the halo, core the sharp centre
  float alpha = (glow * 0.55 + core * 1.1) * vAlpha;

  // Core brightens toward white
  vec3 color = mix(vColor, vec3(1.0), core * 0.75);

  gl_FragColor = vec4(color, alpha);
}
`

// ─── Per-particle initial attributes ─────────────────────────────────
function buildAttributes(count: number) {
  const colors = new Float32Array(count * 3)
  const sizes  = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const t = i / count

    // Gradient: deep blue → ice white → silver
    // Most particles blue-white; occasional brighter highlights
    const bright = Math.random()
    if (bright > 0.96) {
      // Hot white highlight
      colors[i * 3]     = 1.00
      colors[i * 3 + 1] = 1.00
      colors[i * 3 + 2] = 1.00
    } else if (bright > 0.85) {
      // Silver-chrome
      colors[i * 3]     = 0.78 + t * 0.18
      colors[i * 3 + 1] = 0.80 + t * 0.16
      colors[i * 3 + 2] = 0.90 + t * 0.10
    } else {
      // Blue-white base
      colors[i * 3]     = 0.38 + t * 0.42
      colors[i * 3 + 1] = 0.50 + t * 0.38
      colors[i * 3 + 2] = 0.85 + t * 0.15
    }

    // Size distribution: most tiny, some medium, rare large
    const r = Math.random()
    sizes[i] = r > 0.97 ? 4.5 + Math.random() * 2.5
             : r > 0.85 ? 2.2 + Math.random() * 1.8
             :             0.8 + Math.random() * 1.4
  }
  return { colors, sizes }
}

// ─── Component props ──────────────────────────────────────────────────
interface ParticleFieldProps {
  /** Mutable ref holding { section: number } — updated by GSAP in page.tsx */
  scrollState: React.MutableRefObject<{ section: number }>
}

// ─── Main component ───────────────────────────────────────────────────
export default function ParticleField({ scrollState }: ParticleFieldProps) {
  const groupRef  = useRef<THREE.Group>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const matRef    = useRef<THREE.ShaderMaterial>(null)
  const { gl }    = useThree()

  // ── Lerp state (mutable, not React state — updated every frame)
  const lerpPos    = useRef(new Float32Array(SHAPES.sphere))   // current positions
  const targetPos  = useRef(new Float32Array(SHAPES.sphere))   // destination
  const currentSec = useRef(-1)                                // last section index

  // Target world position of the whole group
  const groupTarget = useRef(new THREE.Vector3(2.6, 0, 0))
  const scaleTarget = useRef(1.0)

  // ── Build geometry once
  const { geometry, uniforms } = useMemo(() => {
    const { colors, sizes } = buildAttributes(PARTICLE_COUNT)

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SHAPES.sphere), 3))
    geo.setAttribute('aColor',   new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('aSize',    new THREE.BufferAttribute(sizes,  1))

    const uni = {
      uTime:          { value: 0 },
      uPixelRatio:    { value: gl.getPixelRatio() },
      uGlobalOpacity: { value: 0 }, // starts at 0 — fades in after loader
    }
    return { geometry: geo, uniforms: uni }
  }, [gl])

  // ── Fade in after mount (delay matches loading screen exit ~2.8s)
  useEffect(() => {
    let raf: number
    let start: number
    const DELAY    = 3100   // ms after mount
    const DURATION = 1200   // ms fade

    const tick = (now: number) => {
      if (!start) start = now
      const elapsed = now - start
      if (elapsed >= DELAY) {
        const t = Math.min((elapsed - DELAY) / DURATION, 1)
        uniforms.uGlobalOpacity.value = t * 0.88 // max opacity 0.88
      }
      if (uniforms.uGlobalOpacity.value < 0.88) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [uniforms])

  // ── Dispose geometry on unmount
  useEffect(() => {
    return () => { geometry.dispose() }
  }, [geometry])

  // ── Per-frame: section detection → target swap → lerp → buffer upload
  useFrame(({ clock }) => {
    if (!pointsRef.current || !groupRef.current || !matRef.current) return

    // — Update time uniform
    matRef.current.uniforms.uTime.value = clock.elapsedTime

    // — Detect section change
    const sec = Math.round(scrollState.current.section)
    const clampedSec = Math.min(Math.max(sec, 0), SECTION_CONFIG.length - 1)

    if (clampedSec !== currentSec.current) {
      currentSec.current = clampedSec
      const cfg = SECTION_CONFIG[clampedSec]
      // Swap target position buffer
      targetPos.current = new Float32Array(SHAPES[cfg.shape])
      // Update world-position target
      groupTarget.current.set(...cfg.position)
      scaleTarget.current = cfg.scale
    }

    // — Lerp particle positions (CPU, ~15K floats — fast on typed arrays)
    const cur = lerpPos.current
    const tgt = targetPos.current
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = posAttr.array as Float32Array
    const SPEED = 0.028 // lerp coefficient — adjust for faster/slower morphing

    let dirty = false
    for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
      const diff = tgt[i] - cur[i]
      if (Math.abs(diff) > 0.0002) {
        cur[i] += diff * SPEED
        dirty = true
      } else {
        cur[i] = tgt[i]
      }
      arr[i] = cur[i]
    }
    if (dirty) posAttr.needsUpdate = true

    // — Lerp group world position
    const gp = groupRef.current.position
    gp.x += (groupTarget.current.x - gp.x) * 0.04
    gp.y += (groupTarget.current.y - gp.y) * 0.04
    gp.z += (groupTarget.current.z - gp.z) * 0.04

    // — Lerp scale
    const gs = groupRef.current.scale
    const s  = gs.x + (scaleTarget.current - gs.x) * 0.04
    groupRef.current.scale.setScalar(s)

    // — Ambient rotation (always on)
    groupRef.current.rotation.y += 0.0018
    groupRef.current.rotation.x  = Math.sin(clock.elapsedTime * 0.12) * 0.08
  })

  return (
    <group ref={groupRef} position={[2.6, 0, 0]}>
      <points ref={pointsRef} geometry={geometry}>
        <shaderMaterial
          ref={matRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
