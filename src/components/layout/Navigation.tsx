'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

const NAV_LINKS = [
  { label: 'Capabilities', href: '#features' },
  { label: 'Experience',   href: '#showcase' },
  { label: 'Vision',       href: '#brand'    },
  { label: 'About',        href: '#stats'    },
]

/**
 * Sticky navigation bar.
 * — Transparent on mount; transitions to glass on scroll
 * — Logo fades in from left, links from right
 * — Mobile: collapses to hamburger with fullscreen overlay menu
 */
export default function Navigation() {
  const navRef     = useRef<HTMLElement>(null)
  const logoRef    = useRef<HTMLAnchorElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Entrance animation — fires once on mount
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.nav-item',
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, stagger: 0.06, duration: 0.7, ease: 'power3.out', delay: 2.9 },
      )
    }, navRef)
    return () => ctx.revert()
  }, [])

  // Glass effect on scroll
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 'top -80px',
      onEnter:      () => setScrolled(true),
      onLeaveBack:  () => setScrolled(false),
    })
    return () => trigger.kill()
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      const yOffset = -80
      const y = (target as HTMLElement).getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
    setMenuOpen(false)
  }

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(2,2,2,0.82)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(1.5)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.5)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        }}
        aria-label="Main navigation"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 h-[4.5rem] flex items-center justify-between">
          {/* Logo */}
          <a
            ref={logoRef}
            href="#"
            className="nav-item font-display text-aura-white font-bold tracking-[0.3em] text-[0.9rem] uppercase"
            aria-label="A.U.R.A — Home"
            style={{ cursor: 'none' }}
          >
            A.U.R.A
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-10" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href} className="nav-item">
                <a
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className="relative font-body text-label text-aura-silver hover:text-aura-white transition-colors duration-300 uppercase tracking-[0.18em] group"
                  style={{ cursor: 'none' }}
                >
                  {label}
                  {/* Underline slide */}
                  <span
                    className="absolute -bottom-0.5 left-0 w-full h-px bg-aura-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-expo-out"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-6">
            <a
              href="#cta"
              onClick={(e) => handleNavClick(e, '#cta')}
              className="nav-item hidden md:block btn-ghost text-[0.7rem] py-2 px-4"
              style={{ cursor: 'none' }}
            >
              <span>Request Access</span>
            </a>

            {/* Mobile hamburger */}
            <button
              className="nav-item md:hidden flex flex-col gap-[5px] w-6 h-5 justify-center relative"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              style={{ cursor: 'auto' }}
            >
              <span
                className="block h-px bg-aura-white transition-all duration-350 origin-center"
                style={{ transform: menuOpen ? 'rotate(45deg) translateY(3px)' : 'none' }}
              />
              <span
                className="block h-px bg-aura-white transition-all duration-350"
                style={{ opacity: menuOpen ? 0 : 1 }}
              />
              <span
                className="block h-px bg-aura-white transition-all duration-350 origin-center"
                style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-3px)' : 'none' }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      <div
        className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-aura-black md:hidden transition-all duration-500"
        style={{
          opacity:    menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          clipPath: menuOpen
            ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
            : 'polygon(0 0, 100% 0, 100% 0, 0 0)',
        }}
        aria-hidden={!menuOpen}
      >
        <ul className="flex flex-col items-center gap-8" role="list">
          {NAV_LINKS.map(({ label, href }, i) => (
            <li key={href} style={{ transitionDelay: `${i * 60}ms` }}>
              <a
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                className="font-display text-display-xl text-aura-white tracking-[-0.02em] hover:text-aura-chrome transition-colors duration-300"
              >
                {label}
              </a>
            </li>
          ))}
          <li className="mt-6">
            <a
              href="#cta"
              onClick={(e) => handleNavClick(e, '#cta')}
              className="btn-primary"
            >
              <span>Request Access</span>
            </a>
          </li>
        </ul>
      </div>
    </>
  )
}
