/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0a0e1a',
        'dark-surface': '#111827',
        'dark-border': '#1f2937',
        'blue-accent': '#3b82f6',
        'blue-hover': '#2563eb',
      },
    },
  },
  plugins: [],
}
