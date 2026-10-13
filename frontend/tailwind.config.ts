import type { Config } from 'tailwindcss'

// Ham tao mau tu bien CSS HSL, giu duoc cu phap alpha cua Tailwind (bg-primary/10).
const token = (name: string) => `hsl(var(--${name}) / <alpha-value>)`

const config: Config = {
  // Theo class chu khong theo media: nut chuyen theme phai ep duoc ca hai chieu.
  // Mac dinh van la "theo he dieu hanh" — ThemeProvider tu phan giai ra class.
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: token('border'),
        input: token('input'),
        ring: token('ring'),
        background: token('background'),
        foreground: token('foreground'),
        primary: { DEFAULT: token('primary'), foreground: token('primary-foreground') },
        secondary: { DEFAULT: token('secondary'), foreground: token('secondary-foreground') },
        destructive: { DEFAULT: token('destructive'), foreground: token('destructive-foreground') },
        success: { DEFAULT: token('success'), foreground: token('success-foreground'), soft: token('success-soft') },
        warning: { DEFAULT: token('warning'), foreground: token('warning-foreground'), soft: token('warning-soft') },
        info: { DEFAULT: token('info'), foreground: token('info-foreground'), soft: token('info-soft') },
        muted: { DEFAULT: token('muted'), foreground: token('muted-foreground') },
        accent: { DEFAULT: token('accent'), foreground: token('accent-foreground') },
        popover: { DEFAULT: token('popover'), foreground: token('popover-foreground') },
        card: { DEFAULT: token('card'), foreground: token('card-foreground') },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      // Thang chu: moi cap gom co chu, line-height (boi so 4px) va letter-spacing.
      fontSize: {
        display: ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.025em', fontWeight: '600' }],
        h1: ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em', fontWeight: '600' }],
        h2: ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.015em', fontWeight: '600' }],
        h3: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em', fontWeight: '600' }],
        h4: ['1rem', { lineHeight: '1.5rem', letterSpacing: '-0.005em', fontWeight: '600' }],
        lead: ['1.125rem', { lineHeight: '1.75rem' }],
        body: ['1rem', { lineHeight: '1.5rem' }],
        'body-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        caption: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
        overline: ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.12em', fontWeight: '600' }],
      },
      maxWidth: {
        'prose-ui': '68ch',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      // Bong mem nhieu tang; mau bong doi theo mode qua --shadow-color.
      boxShadow: {
        xs: '0 1px 2px 0 hsl(var(--shadow-color) / 0.06)',
        soft: '0 1px 2px 0 hsl(var(--shadow-color) / 0.05), 0 2px 8px -2px hsl(var(--shadow-color) / 0.06)',
        'soft-md': '0 2px 4px -1px hsl(var(--shadow-color) / 0.06), 0 8px 20px -4px hsl(var(--shadow-color) / 0.10)',
        'soft-lg': '0 4px 8px -2px hsl(var(--shadow-color) / 0.08), 0 20px 40px -8px hsl(var(--shadow-color) / 0.18)',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'word-rise': {
          '0%': { opacity: '0', transform: 'translateY(0.4em)', filter: 'blur(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s linear infinite',
        'word-rise': 'word-rise 450ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-up': 'fade-up 300ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'scale-in': 'scale-in 200ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 200ms ease-out both',
      },
    },
  },
  plugins: [],
}

export default config
