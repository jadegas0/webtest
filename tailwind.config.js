/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        aura: {
          black:   '#020202',
          deep:    '#080810',
          surface: '#0C0C14',
          panel:   '#12121C',
          border:  'rgba(255,255,255,0.07)',
          white:   '#F8F8F8',
          offwhite:'#E8E8E0',
          silver:  '#9B9B9B',
          muted:   '#555560',
          glow:    'rgba(180,170,255,0.12)',
          chrome:  '#C4C8D8',
        },
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-inter)',         'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['clamp(5rem,12vw,14rem)', { lineHeight: '0.92', letterSpacing: '-0.04em' }],
        'display-xl':  ['clamp(3.5rem,7vw,9rem)',  { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display-lg':  ['clamp(2.5rem,4.5vw,6rem)',{ lineHeight: '1.0',  letterSpacing: '-0.025em' }],
        'headline':    ['clamp(1.5rem,2.5vw,3rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'label':       ['0.6875rem',               { lineHeight: '1.4',  letterSpacing: '0.18em'  }],
      },
      animation: {
        grain:       'grain 8s steps(10) infinite',
        'pulse-slow':'pulse 4s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        marquee:     'marquee 28s linear infinite',
      },
      keyframes: {
        grain: {
          '0%,100%': { transform: 'translate(0,0)' },
          '10%':     { transform: 'translate(-4%,-8%)' },
          '20%':     { transform: 'translate(-12%,4%)' },
          '30%':     { transform: 'translate(6%,-20%)' },
          '40%':     { transform: 'translate(-4%,22%)' },
          '50%':     { transform: 'translate(-12%,8%)' },
          '60%':     { transform: 'translate(12%,0%)' },
          '70%':     { transform: 'translate(0%,12%)' },
          '80%':     { transform: 'translate(2%,28%)' },
          '90%':     { transform: 'translate(-8%,8%)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16,1,0.3,1)',
        'expo-in':  'cubic-bezier(0.7,0,0.84,0)',
      },
    },
  },
  plugins: [],
}
