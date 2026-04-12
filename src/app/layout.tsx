import type { Metadata, Viewport } from 'next'
import './globals.css'

// ─── Metadata ────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'A.U.R.A — Adaptive Universal Response Assistant',
  description:
    'A.U.R.A is the ultimate AI home assistant. Groceries, travel, research, smart home, and everything in between — handled intelligently so you can focus on living.',
  keywords: ['AI assistant', 'smart home', 'AI home assistant', 'artificial intelligence', 'luxury AI'],
  authors: [{ name: 'A.U.R.A Inc.' }],
  openGraph: {
    title: 'A.U.R.A — You Decide.',
    description: 'The ultimate AI home assistant. Intelligence, woven into living.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A.U.R.A — You Decide.',
    description: 'The ultimate AI home assistant.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#020202',
  width: 'device-width',
  initialScale: 1,
}

// ─── Root layout ─────────────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Google Fonts loaded via <link> at browser runtime (not build time).
          Space Grotesk → display / headlines
          Inter          → body copy
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* Inline CSS vars so the rest of the CSS can reference them without waiting for next/font */}
        <style>{`
          :root {
            --font-space-grotesk: 'Space Grotesk', system-ui, -apple-system, sans-serif;
            --font-inter: 'Inter', system-ui, -apple-system, sans-serif;
          }
        `}</style>
      </head>
      <body className="bg-aura-black text-aura-white antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
