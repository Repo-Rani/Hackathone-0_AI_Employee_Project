import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans:    ['DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      colors: {
        background:  'hsl(var(--background))',
        'background-2': 'hsl(var(--background-2))',
        'background-3': 'hsl(var(--background-3))',
        foreground:  'hsl(var(--foreground))',
        muted:       'hsl(var(--foreground-muted))',
        border:      'hsl(var(--border))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover:      'hsl(var(--primary-hover))',
        },
        cyan:    { DEFAULT: 'hsl(var(--accent-cyan))', light: 'hsl(var(--accent-cyan-light))' },
        success: { DEFAULT: 'hsl(var(--success))',     light: 'hsl(var(--success-light))' },
        warning: { DEFAULT: 'hsl(var(--warning))',     light: 'hsl(var(--warning-light))' },
        danger:  { DEFAULT: 'hsl(var(--danger))',      light: 'hsl(var(--danger-light))' },
        sidebar: {
          bg:          'hsl(var(--sidebar-bg))',
          border:      'hsl(var(--sidebar-border))',
          hover:       'hsl(var(--sidebar-item-hover))',
          active:      'hsl(var(--sidebar-item-active))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'live-pulse': 'live-pulse 1.5s ease-in-out infinite',
        'shimmer':    'shimmer 1.5s linear infinite',
        'fade-in':    'fade-in 0.3s ease-out',
        'slide-up':   'slide-up 0.4s ease-out',
      },
      keyframes: {
        'fade-in':  { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-up': { from: { opacity: '0', transform: 'translateY(12px)' },
                      to:   { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config