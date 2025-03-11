/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#2D7D9A',
        secondary: '#3CA55C',
        accent: '#F97316',
        background: '#F0F4F8',
        dark: '#1A202C',
        light: '#FFFFFF',
        'black-1': '#1A1A1A',
        'black-2': '#2A2A2A',
        'black-3': '#3A3A3A',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        heading: ['Oswald', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}