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

// ─── Pre-computed shape table ────────────────────────────────────────
// Generated once at module load — shapes are reused across renders.
export type ShapeKey = 'sphere' | 'rings' | 'clusters' | 'helix' | 'grid' | 'denseSphere'

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
