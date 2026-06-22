/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'hero':     ['clamp(2.25rem, 5.5vw, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '400' }],
        'hero-sm':  ['clamp(1.75rem, 4vw, 3rem)',   { lineHeight: '1.1',  letterSpacing: '-0.02em', fontWeight: '400' }],
        'display':  ['clamp(1.75rem, 4vw, 3rem)',   { lineHeight: '1.1',  letterSpacing: '-0.02em', fontWeight: '400' }],
        'subtitle': ['1.125rem',                    { lineHeight: '1.6',  fontWeight: '400' }],
      },
      colors: {
        // Legacy aliases — point at the vellum palette so any v3-style
        // class references resolve to the new design tokens.
        'accent-gold':       '#e8b94a', // marigold-600
        'accent-gold-light': '#f1cc6e', // marigold-500
        'text-muted':        '#6b5a45', // ink-600
        'text-light':        '#8a7860', // ink-500
      },
    },
  },
  plugins: [],
};

export default config;
