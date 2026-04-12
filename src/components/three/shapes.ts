/**
 * Particle shape generators.
 * Each function returns a Float32Array of (x, y, z) triplets.
 * All shapes use the same PARTICLE_COUNT so morphing is a simple lerp
 * between same-length position buffers.
 */

export const PARTICLE_COUNT = 5500

// ─── Fibonacci sphere ────────────────────────────────────────────────
// Even surface distribution + slight volumetric depth variation.
export function genSphere(count: number, radius = 2.1, volumeFactor = 0.12): Float32Array {
  const pos = new Float32Array(count * 3)
  const phi = Math.PI * (Math.sqrt(5) - 1) // golden angle ≈ 2.399 rad

  for (let i = 0; i < count; i++) {
    const y    = 1 - (i / (count - 1)) * 2      // latitude −1 → 1
    const r    = Math.sqrt(Math.max(0, 1 - y * y))
    const th   = phi * i
    const depth = 1 - Math.pow(Math.random(), 2) * volumeFactor // denser on surface

    pos[i * 3]     = Math.cos(th) * r * radius * depth
    pos[i * 3 + 1] = y             * radius * depth
    pos[i * 3 + 2] = Math.sin(th) * r * radius * depth
  }
  return pos
}

// ─── Concentric tilted rings ─────────────────────────────────────────
// Five orbital rings — like capability domains radiating from the core.
export function genRings(count: number): Float32Array {
  const pos = new Float32Array(count * 3)

  const rings = [
    { R: 2.9, thick: 0.055, tiltX:  0.00, tiltZ: 0.00, share: 0.28 },
    { R: 2.1, thick: 0.075, tiltX:  0.45, tiltZ: 0.10, share: 0.22 },
    { R: 1.5, thick: 0.060, tiltX: -0.35, tiltZ: 0.25, share: 0.20 },
    { R: 3.5, thick: 0.040, tiltX:  0.15, tiltZ:-0.20, share: 0.17 },
    { R: 0.8, thick: 0.100, tiltX:  0.60, tiltZ: 0.00, share: 0.13 },
  ]

  let idx = 0
  for (const ring of rings) {
    const n = Math.min(Math.floor(count * ring.share), count - idx)
    for (let i = 0; i < n; i++, idx++) {
      const u  = (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.04
      const sc = (Math.random() - 0.5) * ring.thick * 2
      const r  = ring.R + sc

      const x = Math.cos(u) * r
      const z = Math.sin(u) * r
      // Apply tilt (rotate around X and Z axes by small amounts)
      const y = Math.sin(u) * ring.tiltX * 0.5 + Math.cos(u) * ring.tiltZ * 0.3
               + (Math.random() - 0.5) * 0.07

      pos[idx * 3]     = x
      pos[idx * 3 + 1] = y
      pos[idx * 3 + 2] = z
    }
  }
  // Fill any remainder
  while (idx < count) {
    const u = Math.random() * Math.PI * 2
    pos[idx * 3]     = Math.cos(u) * 2.1
    pos[idx * 3 + 1] = (Math.random() - 0.5) * 0.1
    pos[idx * 3 + 2] = Math.sin(u) * 2.1
    idx++
  }
  return pos
}

// ─── Six gaussian clusters ───────────────────────────────────────────
// One cluster per A.U.R.A capability — symmetrically arranged.
export function genClusters(count: number): Float32Array {
  const pos = new Float32Array(count * 3)

  const centers: [number, number, number][] = [
    [-2.4,  1.5, 0.2],
    [ 0.0,  2.6, 0.0],
    [ 2.4,  1.5,-0.2],
    [-2.4, -1.5,-0.2],
    [ 0.0, -2.6, 0.0],
    [ 2.4, -1.5, 0.2],
  ]
  const perCluster = Math.floor(count / centers.length)

  for (let c = 0; c < centers.length; c++) {
    const [cx, cy, cz] = centers[c]
    const start = c * perCluster
    const end   = c < centers.length - 1 ? start + perCluster : count

    for (let i = start; i < end; i++) {
      // Box-Muller → gaussian spread
      const u1 = Math.max(1e-7, Math.random())
      const u2 = Math.random()
      const mag = Math.sqrt(-2 * Math.log(u1)) * 0.42

      pos[i * 3]     = cx + mag * Math.cos(2 * Math.PI * u2)
      pos[i * 3 + 1] = cy + mag * Math.sin(2 * Math.PI * u2)
      pos[i * 3 + 2] = cz + (Math.random() - 0.5) * 0.35
    }
  }
  return pos
}

// ─── Double helix ────────────────────────────────────────────────────
// Two intertwined spirals — represents stories unfolding over time.
export function genHelix(count: number, radius = 1.7, height = 5.5): Float32Array {
  const pos  = new Float32Array(count * 3)
  const half = Math.floor(count / 2)

  for (let i = 0; i < count; i++) {
    const strand = i < half ? 0 : 1
    const j      = strand === 0 ? i : i - half
    const t      = j / half
    const angle  = t * Math.PI * 8 + strand * Math.PI
    const r      = radius + (Math.random() - 0.5) * 0.14

    pos[i * 3]     = Math.cos(angle) * r
    pos[i * 3 + 1] = (t - 0.5) * height + (Math.random() - 0.5) * 0.07
    pos[i * 3 + 2] = Math.sin(angle) * r
  }
  return pos
}

// ─── 3-D lattice grid ────────────────────────────────────────────────
// Structured data visualisation — represents precision and proof.
export function genGrid(count: number, span = 4.8): Float32Array {
  const pos  = new Float32Array(count * 3)
  const side = Math.round(Math.cbrt(count))
  const step = span / (side - 1)

  for (let i = 0; i < count; i++) {
    const xi = i % side
    const yi = Math.floor(i / side) % side
    const zi = Math.floor(i / (side * side))

    pos[i * 3]     = (xi - (side - 1) / 2) * step + (Math.random() - 0.5) * 0.06
    pos[i * 3 + 1] = (yi - (side - 1) / 2) * step + (Math.random() - 0.5) * 0.06
    pos[i * 3 + 2] = (zi - (side - 1) / 2) * step + (Math.random() - 0.5) * 0.06
  }
  return pos
}

// ─── Dense compact sphere (CTA) ─────────────────────────────────────
// Pulls everything back to the core — the singular promise.
export function genDenseSphere(count: number): Float32Array {
  return genSphere(count, 1.5, 0.30)
}

// ─── Feature icon shapes ─────────────────────────────────────────────
// Each matches one of the 6 capability cards in Features.tsx.

// Feature 0 — Smart Ordering → Shopping Cart
export function genCartIcon(count: number): Float32Array {
  const pos = new Float32Array(count * 3)
  let idx = 0
  const jitter = () => (Math.random() - 0.5) * 0.06

  const fill = (x: number, y: number, z: number) => {
    if (idx >= count) return
    pos[idx * 3]     = x + jitter()
    pos[idx * 3 + 1] = y + jitter()
    pos[idx * 3 + 2] = z + jitter()
    idx++
  }

  const buckets = [
    Math.floor(count * 0.30), // basket body
    Math.floor(count * 0.18), // left wall
    Math.floor(count * 0.18), // right wall
    Math.floor(count * 0.14), // handle
    Math.floor(count * 0.10), // wheel L
    count,                    // wheel R (remainder)
  ]

  // Basket bottom
  for (let i = 0; i < buckets[0]; i++) fill((Math.random() - 0.5) * 3.0, -1.2, (Math.random() - 0.5) * 0.4)
  // Left wall
  for (let i = 0; i < buckets[1]; i++) fill(-1.5, -1.2 + Math.random() * 1.5, (Math.random() - 0.5) * 0.3)
  // Right wall
  for (let i = 0; i < buckets[2]; i++) fill( 1.5, -1.2 + Math.random() * 1.5, (Math.random() - 0.5) * 0.3)
  // Handle arc
  for (let i = 0; i < buckets[3]; i++) {
    const t = (i / buckets[3]) * Math.PI
    fill(Math.cos(t) * 1.5, Math.sin(t) * 1.0 + 0.5, (Math.random() - 0.5) * 0.2)
  }
  // Wheel Left
  for (let i = 0; i < buckets[4]; i++) {
    const t = Math.random() * Math.PI * 2
    fill(-0.8 + Math.cos(t) * 0.35, -1.8 + Math.sin(t) * 0.35, (Math.random() - 0.5) * 0.1)
  }
  // Wheel Right (fill remainder)
  while (idx < count) {
    const t = Math.random() * Math.PI * 2
    fill(0.8 + Math.cos(t) * 0.35, -1.8 + Math.sin(t) * 0.35, (Math.random() - 0.5) * 0.1)
  }
  return pos
}

// Feature 1 — Travel & Dining → Airplane (top-down)
export function genAirplaneIcon(count: number): Float32Array {
  const pos = new Float32Array(count * 3)
  let idx = 0
  const jitter = () => (Math.random() - 0.5) * 0.07

  const fill = (x: number, y: number, z: number) => {
    if (idx >= count) return
    pos[idx * 3]     = x + jitter()
    pos[idx * 3 + 1] = y + jitter()
    pos[idx * 3 + 2] = z + jitter()
    idx++
  }

  const fuselage = Math.floor(count * 0.35)
  const wingL    = Math.floor(count * 0.22)
  const wingR    = Math.floor(count * 0.22)
  const tailL    = Math.floor(count * 0.10)
  const tailR    = Math.floor(count * 0.10)

  // Fuselage (vertical line)
  for (let i = 0; i < fuselage; i++) fill((Math.random() - 0.5) * 0.3, (i / fuselage - 0.5) * 5.0, (Math.random() - 0.5) * 0.2)
  // Wings
  for (let i = 0; i < wingL; i++) {
    const t = i / wingL
    fill(-t * 2.8, t * 0.6 - 0.2, (Math.random() - 0.5) * 0.15)
  }
  for (let i = 0; i < wingR; i++) {
    const t = i / wingR
    fill( t * 2.8, t * 0.6 - 0.2, (Math.random() - 0.5) * 0.15)
  }
  // Tail fins
  for (let i = 0; i < tailL; i++) fill(-i / tailL * 1.2, -2.0 + i / tailL * 0.5, (Math.random() - 0.5) * 0.1)
  while (idx < count)             fill( (idx % 10) / 10 * 1.2, -2.0 + (idx % 10) / 10 * 0.5, (Math.random() - 0.5) * 0.1)
  return pos
}

// Feature 2 — Deep Research → Magnifying Glass
export function genMagnifyingGlassIcon(count: number): Float32Array {
  const pos = new Float32Array(count * 3)
  let idx = 0
  const jitter = () => (Math.random() - 0.5) * 0.06

  const circleCount  = Math.floor(count * 0.72)
  const handleCount  = count - circleCount
  const R = 1.8

  for (let i = 0; i < circleCount; i++) {
    const t   = (i / circleCount) * Math.PI * 2
    const r   = R + (Math.random() - 0.5) * 0.18
    pos[idx * 3]     = Math.cos(t) * r + jitter()
    pos[idx * 3 + 1] = Math.sin(t) * r + 0.5 + jitter()
    pos[idx * 3 + 2] = jitter()
    idx++
  }
  for (let i = 0; i < handleCount; i++) {
    const t = i / handleCount
    pos[idx * 3]     = -(R * 0.707) - t * 1.2 + jitter()
    pos[idx * 3 + 1] = -(R * 0.707) + 0.5 - t * 1.2 + jitter()
    pos[idx * 3 + 2] = jitter()
    idx++
  }
  return pos
}

// Feature 3 — Smart Home → House silhouette
export function genHouseIcon(count: number): Float32Array {
  const pos = new Float32Array(count * 3)
  let idx = 0
  const jitter = () => (Math.random() - 0.5) * 0.07

  const fill = (x: number, y: number, z: number) => {
    if (idx >= count) return
    pos[idx * 3]     = x + jitter()
    pos[idx * 3 + 1] = y + jitter()
    pos[idx * 3 + 2] = z + jitter()
    idx++
  }

  const roofN  = Math.floor(count * 0.28)
  const wallN  = Math.floor(count * 0.32)
  const floorN = Math.floor(count * 0.16)
  const doorN  = Math.floor(count * 0.12)

  // Roof (two slanted lines forming triangle)
  for (let i = 0; i < roofN; i++) {
    const t = i / roofN
    if (t < 0.5) fill(-2.2 + t * 2 * 2.2, 0.6 + t * 2 * 1.8, (Math.random() - 0.5) * 0.2)
    else         fill((t * 2 - 1) * 2.2, 2.4 - (t * 2 - 1) * 1.8, (Math.random() - 0.5) * 0.2)
  }
  // Left & right walls
  for (let i = 0; i < wallN / 2; i++) fill(-2.2, -1.6 + (i / (wallN / 2)) * 2.2, (Math.random() - 0.5) * 0.2)
  for (let i = 0; i < wallN / 2; i++) fill( 2.2, -1.6 + (i / (wallN / 2)) * 2.2, (Math.random() - 0.5) * 0.2)
  // Floor
  for (let i = 0; i < floorN; i++) fill(-2.2 + (i / floorN) * 4.4, -1.6, (Math.random() - 0.5) * 0.2)
  // Door arch
  for (let i = 0; i < doorN; i++) {
    const t = (i / doorN) * Math.PI
    fill(Math.cos(t) * 0.5, Math.sin(t) * 0.7 - 1.1, (Math.random() - 0.5) * 0.1)
  }
  // Fill remainder as scattered house interior
  while (idx < count) fill((Math.random() - 0.5) * 3.6, -1.6 + Math.random() * 2.8, (Math.random() - 0.5) * 0.3)
  return pos
}

// Feature 4 — Finance & Admin → Bar Chart
export function genBarChartIcon(count: number): Float32Array {
  const pos = new Float32Array(count * 3)
  let idx = 0
  const jitter = () => (Math.random() - 0.5) * 0.06

  const bars = [
    { x: -1.8, h: 1.2 },
    { x: -0.6, h: 2.2 },
    { x:  0.6, h: 1.7 },
    { x:  1.8, h: 3.0 },
  ]
  const perBar = Math.floor(count / bars.length)

  for (let b = 0; b < bars.length; b++) {
    const { x, h } = bars[b]
    const n = b < bars.length - 1 ? perBar : count - idx
    for (let i = 0; i < n && idx < count; i++, idx++) {
      pos[idx * 3]     = x + (Math.random() - 0.5) * 0.9 + jitter()
      pos[idx * 3 + 1] = -1.5 + Math.random() * h + jitter()
      pos[idx * 3 + 2] = jitter()
    }
  }
  return pos
}

// Feature 5 — Health & Wellness → Heart
export function genHeartIcon(count: number): Float32Array {
  const pos = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const t     = (i / count) * Math.PI * 2
    const noise = (Math.random() - 0.5) * 0.14

    // Parametric heart: x = 16sin³t, y = 13cost − 5cos2t − 2cos3t − cos4t
    const hx = 16 * Math.pow(Math.sin(t), 3)
    const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)

    pos[i * 3]     = hx * 0.125 + (Math.random() - 0.5) * noise
    pos[i * 3 + 1] = hy * 0.125 + (Math.random() - 0.5) * noise
    pos[i * 3 + 2] = (Math.random() - 0.5) * 0.3
  }
  return pos
}

// ─── Pre-computed shape table ────────────────────────────────────────
// Generated once at module load — shapes are reused across renders.
export type ShapeKey = 'sphere' | 'rings' | 'clusters' | 'helix' | 'grid' | 'denseSphere'


// Feature icon shapes — indexed 0–5 matching FEATURES array in Features.tsx
// 0 Smart Ordering, 1 Travel & Dining, 2 Deep Research,
// 3 Smart Home, 4 Finance & Admin, 5 Health & Wellness
export const FEATURE_SHAPES: Float32Array[] = [
  genCartIcon(PARTICLE_COUNT),
  genAirplaneIcon(PARTICLE_COUNT),
  genMagnifyingGlassIcon(PARTICLE_COUNT),
  genHouseIcon(PARTICLE_COUNT),
  genBarChartIcon(PARTICLE_COUNT),
  genHeartIcon(PARTICLE_COUNT),
]

export const SHAPES: Record<ShapeKey, Float32Array> = {
  sphere:      genSphere(PARTICLE_COUNT),
  rings:       genRings(PARTICLE_COUNT),
  clusters:    genClusters(PARTICLE_COUNT),
  helix:       genHelix(PARTICLE_COUNT),
  grid:        genGrid(PARTICLE_COUNT),
  denseSphere: genDenseSphere(PARTICLE_COUNT),
}

// Section index → shape + group world-position
export const SECTION_CONFIG: Array<{
  shape: ShapeKey
  position: [number, number, number]
  scale: number
  label: string
}> = [
  { shape: 'sphere',      position: [ 2.6,  0.0, 0], scale: 1.00, label: 'Hero'     },
  { shape: 'rings',       position: [ 0.0,  0.0, 0], scale: 1.05, label: 'Brand'    },
  { shape: 'clusters',    position: [ 2.0,  0.0, 0], scale: 0.90, label: 'Features' },
  { shape: 'helix',       position: [-2.0,  0.0, 0], scale: 0.95, label: 'Showcase' },
  { shape: 'grid',        position: [ 2.4,  0.6, 0], scale: 0.90, label: 'Stats'    },
  { shape: 'denseSphere', position: [ 0.0,  1.5, 0], scale: 1.10, label: 'CTA'      },
]
