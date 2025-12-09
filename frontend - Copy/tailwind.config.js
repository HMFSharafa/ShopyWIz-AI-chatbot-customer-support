/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#1e3a8a',
        'navy-light': '#3b82f6',
        'primary': '#4F46E5',
        'primary-600': '#2563EB',
        'muted': '#64748B',
      },
    },
  },
  plugins: [],
}

