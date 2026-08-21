/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0b0f19',
          card: '#0f172a',
          border: '#1e293b'
        }
      }
    },
  },
  plugins: [],
}
