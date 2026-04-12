# A.U.R.A — Premium Immersive Website

> **A**daptive **U**niversal **R**esponse **A**ssistant  
> *Intelligence, Woven Into Living.*

A cinematic, scroll-driven landing page built for A.U.R.A — a luxury AI home assistant. Built to the quality standard of award-winning digital experiences.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
open http://localhost:3000
```

```bash
# Production build
npm run build && npm start
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | React 18 + TypeScript |
| Styling | Tailwind CSS |
| 3D / WebGL | React Three Fiber + Three.js |
| Scroll animation | GSAP + ScrollTrigger |
| Smooth scroll | Lenis |

---

## Architecture

```
src/
├── app/
│   ├── layout.tsx       # Root layout — fonts, metadata, viewport
│   ├── page.tsx         # Page orchestrator — loading, scroll, sections
│   └── globals.css      # Design tokens, base styles, utilities
│
├── components/
│   ├── layout/
│   │   ├── Navigation.tsx    # Sticky nav — transparent → glass on scroll
│   │   └── Footer.tsx        # Minimal footer
│   │
│   ├── sections/
│   │   ├── Hero.tsx          # Fullscreen hero — 3D orb + headline
│   │   ├── Brand.tsx         # Manifesto + marquee
│   │   ├── Features.tsx      # Scroll-pinned capability cards
│   │   ├── Showcase.tsx      # Cinematic use-case scenes
│   │   ├── Stats.tsx         # Animated counters + testimonial
│   │   └── CTA.tsx           # Conversion — email waitlist
│   │
│   ├── three/
│   │   ├── HeroScene.tsx     # R3F Canvas — lights, camera
│   │   └── AuraOrb.tsx       # 3D orb — custom GLSL shaders
│   │
│   └── ui/
│       ├── LoadingScreen.tsx # Polished intro — GSAP choreography
│       ├── Cursor.tsx        # Dual-ring custom cursor with lag
│       ├── SoundToggle.tsx   # Sound on/off (placeholder)
│       └── GrainOverlay.tsx  # CSS animated film grain
│
├── hooks/
│   ├── useLenis.ts           # Lenis init — wired to GSAP ticker
│   └── useReducedMotion.ts   # Respects prefers-reduced-motion
│
└── lib/
    └── utils.ts              # clsx/twMerge, clamp, lerp, mapRange
```

---

## Animation System

### Scroll Engine
Lenis provides **sub-pixel smooth scroll** on every input method (wheel, trackpad, touch). Its scroll position is piped into GSAP's ticker so that `ScrollTrigger` animations stay perfectly in sync.

```ts
// hooks/useLenis.ts — the key wiring
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
```

### Text Reveals
Text is manually split into word spans using `.word-clip` / `.word-inner` CSS containers. The inner span starts at `translateY(110%)` (below clip), and GSAP animates it to `Y(0)` with a stagger. This creates the "words slide up from behind a mask" effect.

### 3D Orb — GLSL Shaders
The hero orb is a `IcosahedronGeometry` (subdivision 7 = ~20K triangles) with a fully custom `ShaderMaterial`:

- **Vertex shader**: Multi-octave simplex noise displaces each vertex along its normal. The noise is time-animated (breathing) and mouse-reactive (subtle bulge toward cursor).
- **Fragment shader**: Fresnel equation powers an iridescent edge glow. A directional specular highlight creates a chrome hotspot. The iridescent hue cycles slowly over time using `sin()` phase offsets.
- **Particle ring**: A `Points` geometry orbits the sphere using `rotation.y` in `useFrame`.

### Section Transitions
Each section uses `ScrollTrigger` with `toggleActions: 'play none none none'` for one-shot reveals — no reversals that cause jank. Parallax elements use `scrub: true` for frame-perfect scroll binding.

### Loading Screen
A `gsap.timeline()` choreographs:
1. Letters blur-in (`filter: blur` → 0, stagger 90ms)
2. Tagline fade
3. Progress bar fill (1.4s, `power1.inOut`)
4. Slide-out: `yPercent: -100` with `power3.inOut`

---

## Performance Notes

- **DPR capped at 1.5** in Three.js canvas — prevents GPU overload on high-DPI screens
- **SSR disabled** for Three.js components via `next/dynamic` with `{ ssr: false }`
- **Lazy loading**: heavy components only render client-side
- **`will-change: transform`** applied only to actively animated elements
- **`prefers-reduced-motion`**: all GSAP animations are skipped; CSS animations disabled via media query
- **Mobile**: Three.js orb still renders on mobile but the canvas is wrapped in a smaller container; the grain overlay and marquee use pure CSS (zero JS)

---

## Customisation

### Brand colors — `tailwind.config.js`
```js
colors: {
  aura: {
    black:   '#020202',   // page background
    white:   '#F8F8F8',   // primary text
    silver:  '#9B9B9B',   // secondary text
    chrome:  '#C4C8D8',   // accent gradient
    muted:   '#555560',   // tertiary / labels
  }
}
```

### Orb appearance — `src/components/three/AuraOrb.tsx`
Edit `uDisplacementStrength`, `uColor1/2`, `fresnel` power in the GLSL fragment shader to change the orb's character.

### Section content — individual section files
All copy, stats, and feature data are defined as constant arrays at the top of each section component — easy to update without touching animation logic.

---

## Accessibility

- Semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<blockquote>`)
- Skip-to-content link for keyboard users
- All animations skip on `prefers-reduced-motion: reduce`
- Custom cursor hidden on touch/pointer-coarse devices
- ARIA labels on interactive elements and decorative regions (`aria-hidden="true"`)
- `role="status"` and `aria-live="polite"` on form feedback

---

## Extending

**Add a section**: Create `src/components/sections/YourSection.tsx`, import in `page.tsx`, add `id` for nav linking.

**Add real audio**: Wire `SoundToggle` to a Web Audio API context or howler.js. The toggle state is already managed in `useState`.

**Add a backend**: Replace the `handleSubmit` placeholder in `CTA.tsx` with a fetch to your API route (`/api/waitlist`).

**Deploy**: Works on Vercel out of the box — `next build` then push to your Vercel project.
