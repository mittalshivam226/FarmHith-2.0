/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        // Primary — FarmHith Deep Green
        primary: {
          50:  '#f0faf4',
          100: '#d8f3e3',
          200: '#b3e6c9',
          300: '#7ed0a8',
          400: '#46b47f',
          500: '#2d8f62',
          600: '#1e7048',  // ← Brand primary
          700: '#185a3a',
          800: '#144530',
          900: '#0f3322',
          950: '#081a12',
        },
        // Accent — Warm Amber (harvest / crop energy)
        accent: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fbbf24',
          400: '#f59e0b',
          500: '#d97706',
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
        },
        // Earth — Warm clay tones
        earth: {
          50:  '#fdf8f0',
          100: '#f8edda',
          200: '#f0d9b0',
          300: '#e4bc7a',
          400: '#d49c44',
          500: '#c4832a',
          600: '#a86820',
          700: '#8a511c',
          800: '#6e3f1a',
          900: '#5a3317',
        },
        // Neutral — Slate tones for text and borders
        slate: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card':    '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
        'card-lg': '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)',
        'card-xl': '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)',
        'glow-green': '0 0 24px 0 rgb(30 112 72 / 0.18)',
        'glow-amber': '0 0 24px 0 rgb(245 158 11 / 0.18)',
        'inner-sm': 'inset 0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },
      animation: {
        'fade-in':     'fadeIn 0.4s ease-out',
        'slide-up':    'slideUp 0.4s ease-out',
        'slide-down':  'slideDown 0.3s ease-out',
        'scale-in':    'scaleIn 0.3s ease-out',
        'spin-slow':   'spin 3s linear infinite',
        'pulse-slow':  'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer':     'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'hero-mesh':     'radial-gradient(at 80% 0%, hsla(145,60%,20%,0.18) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(38,90%,60%,0.12) 0px, transparent 50%)',
        'card-gradient': 'linear-gradient(135deg, hsla(145,30%,98%,1) 0%, hsla(30,40%,97%,1) 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.5) 50%, transparent 75%)',
      },
    },
  },
  plugins: [],
};
