/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      /* ──────────────────────────────────────────────────────────────────────
       * COLORS — FarmHith Design System (Authentic Agricultural Palette)
       * ──────────────────────────────────────────────────────────────────── */
      colors: {
        // Primary — Forest Green (Core Brand)
        primary: {
          50:  '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',  // Leaf Green accent
          500: '#4caf50',
          600: '#388e3c',
          700: '#2e7d32',  // Forest Green main brand color
          800: '#1b5e20',
          900: '#144617',
          950: '#0a230c',
        },
        // Secondary / Harvest — Harvest Yellow / Gold / Warm Amber
        secondary: {
          50:  '#fffde7',
          100: '#fff9c4',
          200: '#fff59d',
          300: '#fff176',
          400: '#ffee58',
          500: '#f9a825',  // Harvest Yellow
          600: '#f57f17',
          700: '#e65100',
          800: '#bf360c',
          900: '#78350f',
        },
        // Stone & Slate — Clean, warm neutrals & crisp charcoal
        slate: {
          50:  '#f8faf5',  // Warm Off-White background
          100: '#f1f5f0',
          200: '#e2e8e0',  // Subtle borders
          300: '#cbd5c8',
          400: '#94a398',
          500: '#64748b',
          600: '#475569',
          700: '#37474f',  // Deep charcoal secondary
          800: '#263238',  // Charcoal primary text
          900: '#1a2327',
          950: '#0f1719',
        },

        /* ── Semantic aliases ── */
        success: {
          50: '#e8f5e9', 100: '#c8e6c9', 500: '#2e7d32', 600: '#1b5e20', 700: '#144617',
        },
        warning: {
          50: '#fffde7', 100: '#fff9c4', 500: '#f9a825', 600: '#f57f17', 700: '#d97706',
        },
        error: {
          50: '#fef2f2', 100: '#fee2e2', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c',
        },
        info: {
          50: '#eff6ff', 100: '#dbeafe', 500: '#0284c7', 600: '#0369a1', 700: '#075985',
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

      /* ── Border Radius ── */
      borderRadius: {
        'sm':   '6px',
        'DEFAULT': '8px',
        'md':   '10px',
        'lg':   '14px',
        'xl':   '18px',
        '2xl':  '24px',
        'full': '9999px',
      },

      /* ── Shadows — Natural & Crisp ── */
      boxShadow: {
        'xs':     '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'sm':     '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
        'DEFAULT': '0 2px 6px -1px rgb(0 0 0 / 0.08), 0 1px 4px -2px rgb(0 0 0 / 0.05)',
        'md':     '0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 6px -2px rgb(0 0 0 / 0.04)',
        'lg':     '0 10px 24px -4px rgb(0 0 0 / 0.08), 0 4px 8px -4px rgb(0 0 0 / 0.03)',
        'xl':     '0 16px 36px -6px rgb(0 0 0 / 0.1), 0 8px 16px -6px rgb(0 0 0 / 0.05)',
        'card':   '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card-hover': '0 8px 24px -4px rgba(46, 125, 50, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'inner':  'inset 0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'none':   '0 0 #0000',
      },

      /* ── Animations ── */
      animation: {
        'fade-in':     'fadeIn 0.2s ease-out',
        'slide-up':    'slideUp 0.25s ease-out',
        'slide-down':  'slideDown 0.2s ease-out',
        'scale-in':    'scaleIn 0.2s ease-out',
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
      },

      maxWidth: {
        'page': '1280px',
      },
    },
  },
  plugins: [],
};
