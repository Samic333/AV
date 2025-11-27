/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        aviation: {
          blue: '#1e3a8a', // Deep sky blue / navy
          light: '#3b82f6', // Light sky blue
          sky: '#e0f2fe', // Very light sky
          amber: '#f59e0b', // Aviation amber/orange
          teal: '#14b8a6', // Teal accent
        },
      },
    },
  },
  plugins: [],
}

