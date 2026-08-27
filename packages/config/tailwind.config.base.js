/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      /* ──────────────────────────────────────────────────────────────────────
       * COLORS — FarmHith Design System (Cinematic Agritech Dark Mode)
       * ──────────────────────────────────────────────────────────────────── */
      colors: {
        // Primary — HUD Neon Green
        primary: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',  // ← Main HUD glow
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // Secondary — Amber/Gold for contrast
        secondary: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Slate — Dark Agritech Neutrals (Greens/Blacks)
        slate: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#223D2E',  // Dark green borders
          800: '#12221A',  // Surface / Cards
          900: '#0A140F',  // Backgrounds
          950: '#050B08',  // Deepest background
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

      /* ── Shadows — Dark mode HUD glows ── */
      boxShadow: {
        'xs':     '0 1px 2px 0 rgb(0 0 0 / 0.5)',
        'sm':     '0 1px 3px 0 rgb(0 0 0 / 0.6), 0 1px 2px -1px rgb(0 0 0 / 0.6)',
        'DEFAULT': '0 2px 6px -1px rgb(0 0 0 / 0.7), 0 1px 4px -2px rgb(0 0 0 / 0.5)',
        'md':     '0 4px 8px -2px rgb(0 0 0 / 0.8), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
        'lg':     '0 10px 20px -4px rgb(0 0 0 / 0.9), 0 4px 6px -4px rgb(0 0 0 / 0.5)',
        'xl':     '0 16px 40px -6px rgb(0 0 0 / 0.95), 0 8px 16px -6px rgb(0 0 0 / 0.6)',
        'inner':  'inset 0 1px 2px 0 rgb(0 0 0 / 0.5)',
        'none':   '0 0 #0000',
        'glow-sm': '0 0 10px rgba(16, 185, 129, 0.2), inset 0 0 5px rgba(16, 185, 129, 0.1)',
        'glow-md': '0 0 20px rgba(16, 185, 129, 0.3), inset 0 0 10px rgba(16, 185, 129, 0.2)',
        'glow-primary': '0 0 15px rgba(16, 185, 129, 0.4)',
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
