/** @type {import('tailwindcss').Config} */
/**
 * Design tokens — golden-amber "Z Rentals" direction from the Stitch project
 * (projects/4096618961977056422) + SPECS.md palette. Dark glassmorphism,
 * golden amber primary, electric blue informational accents.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Surfaces (deep black with a subtle blue-black tint per SPECS #0A0A14)
        surface: {
          DEFAULT: '#0f0f18',
          dim: '#0a0a14',
          bright: '#34343f',
          lowest: '#0a0a14',
          low: '#121219',
          container: '#16161f',
          high: '#1d1d28',
          highest: '#252532',
          variant: '#252532',
        },
        'on-surface': {
          DEFAULT: '#e8e5e1',
          variant: '#b8b5ae',
        },
        outline: {
          DEFAULT: '#8e8a82',
          variant: '#3a3a46',
        },
        // Brand
        primary: {
          DEFAULT: '#e8942d', // golden amber — CTAs, headlines, branding
          light: '#f2b765',
          on: '#231200', // dark text on amber surfaces
          fixed: '#ffe3c2',
        },
        secondary: {
          DEFAULT: '#1e90ff', // electric blue — info, nav highlights, category badges
          light: '#7cc0ff',
          container: '#0f5cad',
          on: '#e3f1ff',
        },
        tertiary: {
          DEFAULT: '#06b6d4',
          light: '#4cd7f6',
          container: '#00788c',
          on: '#d7f6ff',
        },
        // Functional
        error: {
          DEFAULT: '#ffb4ab',
          container: '#93000a',
          on: '#690005',
        },
        success: '#34d399', // emerald
        warning: '#fbbf24', // amber (notices)
        danger: '#ef5350', // crimson (legible on dark)
        background: '#0a0a14',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans Variable"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Aura Drive typography scale
        'headline-xl': ['40px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '800' }],
        'headline-xl-mobile': ['32px', { lineHeight: '40px', fontWeight: '800' }],
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'headline-sm': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '20px', letterSpacing: '0.02em', fontWeight: '600' }],
        'label-sm': ['12px', { lineHeight: '16px', fontWeight: '500' }],
      },
      borderRadius: {
        sm: '0.5rem',
        DEFAULT: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
      },
      spacing: {
        gutter: '16px',
        'margin-mobile': '20px',
        'margin-desktop': '120px',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #f2b765 0%, #e8942d 55%, #d97f1a 100%)',
      },
      boxShadow: {
        glow: '0 0 24px 0 rgba(232, 148, 45, 0.45)',
        'glow-sm': '0 0 12px 0 rgba(232, 148, 45, 0.35)',
        ambient: '0 24px 64px -16px rgba(232, 148, 45, 0.25)',
      },
      backdropBlur: {
        glass: '24px',
      },
    },
  },
  plugins: [],
}
