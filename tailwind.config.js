import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
    },
    fontFamily: {
      heading: [
        '"JetBrains Mono"',
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        '"Liberation Mono"',
        '"Courier New"',
        'monospace',
      ],
      body: [
        '"Roboto Mono"',
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        '"Liberation Mono"',
        '"Courier New"',
        'monospace',
      ],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ink: 'var(--tt-bg)',
      panel: 'var(--tt-panel)',
      panel2: 'var(--tt-panel2)',
      text: 'var(--tt-text)',
      muted: 'var(--tt-muted)',
      border: 'var(--tt-border)',
      danger: 'var(--tt-danger)',
      primary: 'var(--tt-primary)',
      cyan: 'var(--tt-cyan)',
      success: 'var(--tt-success)',
      warning: 'var(--tt-warning)',
    },
  },
  plugins: [forms, typography],
}

