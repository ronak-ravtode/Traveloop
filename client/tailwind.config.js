/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0F766E', light: '#14B8A6', dark: '#0D9488' },
        secondary: { DEFAULT: '#6366F1', light: '#818CF8', dark: '#4F46E5' },
        accent: { DEFAULT: '#F59E0B', light: '#FBBF24', dark: '#D97706' },
        dark: { DEFAULT: '#0F172A', light: '#1E293B', lighter: '#334155' },
        surface: { DEFAULT: '#FFFFFF', alt: '#F8FAFC' },
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
