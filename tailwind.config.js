/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#282828',
        'brand-light': '#F9F9F9',
        'brand-text': '#F9F9F9',
        'brand-red': '#C83C2F',
        'brand-highlightRed': '#C83C2F',
        'brand-blue': '#1E3F66',
        'brand-highlightBlue': '#1E3F66',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Karla', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
