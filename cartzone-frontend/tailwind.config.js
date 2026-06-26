/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        graphite: '#1a1a1a',
        porcelain: '#f8f7f4',
        sand: '#e8e0d0',
        gold: '#c9a84c',
        emerald: '#2d7a5f',
        amber: '#d48c2e',
        ruby: '#b03a3a',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
