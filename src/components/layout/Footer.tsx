'use client'

const FOOTER_LINKS = {
  Product:  ['Features', 'Integrations', 'Roadmap', 'Changelog'],
  Company:  ['About', 'Careers', 'Press', 'Contact'],
  Legal:    ['Privacy', 'Terms', 'Cookies'],
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="border-t border-[rgba(255,255,255,0.06)] bg-aura-black"
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <p className="font-display text-aura-white font-bold tracking-[0.3em] text-[0.85rem] uppercase mb-4">
              A.U.R.A
            </p>
            <p className="font-body text-sm text-aura-silver leading-relaxed max-w-[280px]">
              The ultimate AI home assistant. One voice for every decision, every moment, every day.
            </p>

            {/* Social / contact */}
            <div className="mt-8 flex items-center gap-5">
              {['X', 'In', 'GH'].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  aria-label={icon}
                  className="w-8 h-8 flex items-center justify-center border border-[rgba(255,255,255,0.1)] text-aura-muted hover:text-aura-white hover:border-[rgba(255,255,255,0.3)] transition-all duration-300 font-display text-[0.65rem] font-bold tracking-wider"
                  style={{ cursor: 'none' }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-display text-label text-aura-muted uppercase tracking-[0.2em] mb-5">
                {section}
              </h3>
              <ul className="space-y-3" role="list">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-body text-sm text-aura-silver hover:text-aura-white transition-colors duration-300"
                      style={{ cursor: 'none' }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-[rgba(255,255,255,0.05)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-body text-[0.75rem] text-aura-muted">
            © {year} A.U.R.A Inc. All rights reserved.
          </p>
          <p className="font-body text-[0.75rem] text-aura-muted tracking-[0.05em]">
            Crafted for the future.
          </p>
        </div>
      </div>
    </footer>
  )
}
