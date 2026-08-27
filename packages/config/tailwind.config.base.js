/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      /* ──────────────────────────────────────────────────────────────────────
       * COLORS — FarmHith Design System
       * Single source of truth. Every hex that appears on screen derives
       * from one of these scales.
       * ──────────────────────────────────────────────────────────────────── */
      colors: {
        // Primary — Deep teal (brand: #00838F → #006064)
        primary: {
          50:  '#e6f5f6',
          100: '#b3e0e4',
          200: '#80ccd2',
          300: '#4db8c0',
          400: '#26a8b2',
          500: '#00838F',  // ← Main brand
          600: '#006064',  // ← Dark brand
          700: '#004D50',
          800: '#003A3D',
          900: '#00272A',
        },
        // Secondary — Warm tan/sand (brand: #D2B48C)
        secondary: {
          50:  '#faf7f2',
          100: '#f2ede3',
          200: '#e6dcc8',
          300: '#D2B48C',  // ← Main tan
          400: '#c4a070',
          500: '#b08c58',
          600: '#96733f',
          700: '#7a5d33',
          800: '#5e4727',
          900: '#42311c',
        },
        // Accent — Harvest amber (sparingly, for highlights)
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
        // Neutral — Slate for text, borders, and backgrounds
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

        /* ── Semantic aliases ── */
        success: {
          50: '#f0fdf4', 100: '#dcfce7', 500: '#22c55e', 600: '#16a34a', 700: '#15803d',
        },
        warning: {
          50: '#fffbeb', 100: '#fef3c7', 500: '#f59e0b', 600: '#d97706', 700: '#b45309',
        },
        error: {
          50: '#fef2f2', 100: '#fee2e2', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c',
        },
        info: {
          50: '#eff6ff', 100: '#dbeafe', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
        },
      },

      /* ── Typography ── */
      fontFamily: {
        sans:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        // Design-system type scale
        'display-lg': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.025em', fontWeight: '800' }],
        'display':    ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.025em', fontWeight: '800' }],
        'heading':    ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.02em', fontWeight: '700' }],
        'subheading': ['1.125rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-lg':    ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body':       ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm':    ['0.8125rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption':    ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
        'overline':   ['0.6875rem', { lineHeight: '1.3', letterSpacing: '0.06em', fontWeight: '700' }],
        'stat':       ['2rem', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '800' }],
      },

      /* ── Spacing ── */
      // Using Tailwind default 4px scale. No arbitrary values needed.

      /* ── Border Radius — Restrained ── */
      borderRadius: {
        'sm':   '4px',    // subtle rounding: badges, small chips
        'DEFAULT': '6px', // inputs, buttons
        'md':   '8px',    // cards, dropdowns
        'lg':   '12px',   // modals, larger panels
        'xl':   '16px',   // hero cards, page sections
        'full': '9999px', // avatars, pills (used sparingly)
      },

      /* ── Shadows — Subtle elevation only ── */
      boxShadow: {
        'xs':     '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        'sm':     '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'DEFAULT': '0 2px 6px -1px rgb(0 0 0 / 0.07), 0 1px 4px -2px rgb(0 0 0 / 0.05)',
        'md':     '0 4px 8px -2px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        'lg':     '0 10px 20px -4px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
        'xl':     '0 16px 40px -6px rgb(0 0 0 / 0.12), 0 8px 16px -6px rgb(0 0 0 / 0.06)',
        'inner':  'inset 0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'none':   '0 0 #0000',
      },

      /* ── Animations — Only purposeful transitions ── */
      animation: {
        'fade-in':     'fadeIn 0.2s ease-out',
        'slide-up':    'slideUp 0.25s ease-out',
        'slide-down':  'slideDown 0.2s ease-out',
        'scale-in':    'scaleIn 0.2s ease-out',
        'shimmer':     'shimmer 1.5s linear infinite',
        'spin':        'spin 0.8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },

      /* ── Misc ── */
      backgroundImage: {
        'shimmer-gradient': 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.4) 50%, transparent 75%)',
      },
      maxWidth: {
        'page': '1280px',
      },
    },
  },
  plugins: [],
};
