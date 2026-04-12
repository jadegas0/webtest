'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// ─── GLSL: Simplex 3-D noise ──────────────────────────────────────────
// Classic Stefan Gustavson implementation (MIT)
const NOISE_GLSL = /* glsl */`
vec3 mod289_3(vec3 x){ return x - floor(x*(1./289.))*289.; }
vec4 mod289_4(vec4 x){ return x - floor(x*(1./289.))*289.; }
vec4 permute4(vec4 x){ return mod289_4(((x*34.)+1.)*x); }
vec4 taylorInvSqrt4(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }

float snoise(vec3 v){
  const vec2 C = vec2(1./6., 1./3.);
  const vec4 D = vec4(0., .5, 1., 2.);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g  = step(x0.yzx, x0.xyz);
  vec3 l  = 1. - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289_3(i);
  vec4 p = permute4(permute4(permute4(
    i.z + vec4(0.,i1.z,i2.z,1.)) +
    i.y + vec4(0.,i1.y,i2.y,1.)) +
    i.x + vec4(0.,i1.x,i2.x,1.));
  float n_ = .142857142857;
  vec3  ns = n_*D.wyz - D.xzx;
  vec4 j   = p - 49.*floor(p*ns.z*ns.z);
  vec4 x_  = floor(j*ns.z);
  vec4 y_  = floor(j - 7.*x_);
  vec4 x   = x_*ns.x + ns.yyyy;
  vec4 y   = y_*ns.x + ns.yyyy;
  vec4 h   = 1. - abs(x) - abs(y);
  vec4 b0  = vec4(x.xy, y.xy);
  vec4 b1  = vec4(x.zw, y.zw);
  vec4 s0  = floor(b0)*2.+1.;
  vec4 s1  = floor(b1)*2.+1.;
  vec4 sh  = -step(h, vec4(0.));
  vec4 a0  = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1  = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0  = vec3(a0.xy, h.x);
  vec3 p1  = vec3(a0.zw, h.y);
  vec3 p2  = vec3(a1.xy, h.z);
  vec3 p3  = vec3(a1.zw, h.w);
  vec4 norm= taylorInvSqrt4(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m = max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.);
  m = m*m;
  return 42.*dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`

// ─── Vertex shader ────────────────────────────────────────────────────
const vertexShader = /* glsl */`
${NOISE_GLSL}

uniform float uTime;
uniform vec2  uMouse;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vDisplace;

void main(){
  vec3 pos = position;

  // Multi-octave noise displacement for organic breathing
  float n1 = snoise(pos * 0.55 + uTime * 0.12);
  float n2 = snoise(pos * 1.2  - uTime * 0.08) * 0.5;
  float n3 = snoise(pos * 2.4  + uTime * 0.18) * 0.25;
  float displacement = (n1 + n2 + n3) * 0.32;

  // Mouse-reactive bulge (subtle)
  float mouseInfluence = dot(normalize(pos), vec3(uMouse.x, uMouse.y, 0.5)) * 0.12;
  displacement += mouseInfluence;

  vec3 displaced = pos + normalize(pos) * displacement;
  vDisplace = displacement;
  vNormal   = normalize(normalMatrix * normal);
  vWorldPos = (modelMatrix * vec4(displaced, 1.)).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.);
}
`

// ─── Fragment shader ──────────────────────────────────────────────────
const fragmentShader = /* glsl */`
${NOISE_GLSL}

uniform float uTime;
uniform vec3  uCameraPos;

varying vec3  vNormal;
varying vec3  vWorldPos;
varying float vDisplace;

void main(){
  vec3 viewDir = normalize(uCameraPos - vWorldPos);
  vec3 n       = normalize(vNormal);

  // Fresnel — strong edge glow
  float fresnel = pow(1. - max(dot(n, viewDir), 0.), 2.8);

  // Base dark metallic
  vec3 base = vec3(0.03, 0.03, 0.06);

  // Chrome highlight — directional
  vec3 lightDir = normalize(vec3(1.2, 1.8, 1.5));
  float spec    = pow(max(dot(reflect(-lightDir, n), viewDir), 0.), 32.);
  vec3 chrome   = vec3(0.65, 0.68, 0.78) * spec * 0.7;

  // Iridescent edge — cycles subtly over time
  float iridPhase = uTime * 0.12 + vDisplace * 3.;
  vec3 irid = vec3(
    0.42 + 0.3 * sin(iridPhase),
    0.45 + 0.3 * sin(iridPhase + 2.094),
    0.55 + 0.3 * sin(iridPhase + 4.189)
  );

  // Noise-based surface micro-detail
  float surface = snoise(vWorldPos * 3.5 + uTime * 0.05) * 0.04;
  base += surface;

  // Final composite
  vec3 color = base + chrome;
  color = mix(color, irid * 0.9, fresnel * 0.75);
  color += vec3(0.55, 0.60, 0.80) * pow(fresnel, 4.) * 1.4; // rim light

  // Subtle inner glow on convex areas
  float innerGlow = snoise(vWorldPos * 1.2 - uTime * 0.08) * 0.5 + 0.5;
  color += vec3(0.10, 0.08, 0.20) * innerGlow * (1. - fresnel) * 0.3;

  gl_FragColor = vec4(color, 0.92);
}
`

// ─── Particle ring around the orb ─────────────────────────────────────
function ParticleRing({ count = 180 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes     = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const angle  = (i / count) * Math.PI * 2
      const radius = 2.9 + Math.random() * 0.55
      const tilt   = (Math.random() - 0.5) * 0.6
      positions[i * 3]     = Math.cos(angle) * radius
      positions[i * 3 + 1] = tilt
      positions[i * 3 + 2] = Math.sin(angle) * radius
      sizes[i] = Math.random() * 2.5 + 0.5
    }
    return { positions, sizes }
  }, [count])

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.06
      ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.04) * 0.08
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color="#B8C0D8"
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  )
}

// ─── Main orb mesh ────────────────────────────────────────────────────
export function AuraOrb() {
  const meshRef  = useRef<THREE.Mesh>(null)
  const { camera } = useThree()

  const uniforms = useMemo(() => ({
    uTime:      { value: 0 },
    uMouse:     { value: new THREE.Vector2(0, 0) },
    uCameraPos: { value: new THREE.Vector3() },
  }), [])

  useFrame(({ clock, mouse }) => {
    uniforms.uTime.value      = clock.elapsedTime
    uniforms.uMouse.value.set(mouse.x * 0.35, mouse.y * 0.35)
    uniforms.uCameraPos.value.copy(camera.position)

    if (meshRef.current) {
      // Slow ambient rotation
      meshRef.current.rotation.y += 0.0025
      meshRef.current.rotation.x += 0.0008
      // Subtle float
      meshRef.current.position.y = Math.sin(clock.elapsedTime * 0.4) * 0.07
    }
  })

  return (
    <group>
      {/* The orb */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.9, 7]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Subtle wireframe overlay for depth */}
      <mesh>
        <icosahedronGeometry args={[1.92, 3]} />
        <meshBasicMaterial
          color="#4A4E60"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>

      {/* Orbiting particles */}
      <ParticleRing count={200} />
    </group>
  )
}
