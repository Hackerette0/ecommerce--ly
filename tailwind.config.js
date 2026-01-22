/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'oly-pink': '#ff69b4',
        'oly-light': '#fff0f5',
        'oly-dark': '#c71585',
      }
    }
  },
  plugins: [],
}