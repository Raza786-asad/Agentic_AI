/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: { bg: '#0a0f1e', card: '#0d1530', border: '#1e2d4a' },
        // Override slate dark end to cleaner blue-blacks
        slate: {
          900: '#0f1729',   // was #0f172a — slightly bluer, cleaner
          950: '#0a0e1a',   // was #020617 — clean dark navy instead of coal-black
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
