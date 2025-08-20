/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./graphics/**/*.{html,js}",
    "./dashboard/**/*.{html,js}",
    "./examples/**/*.{html,js}",
    "./shared/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        // Generic color scheme
        primaryDark: '#242D38',
        secondaryBlue: '#0F79C6',
        darkBg: '#080A0C',
        lightText: '#f7fafc',
        accentPink: '#002ea2',
        grayText: '#637786',
      }
    },
    fontFamily: {
      sans: [ 'Lexend Mega', 'sans-serif' ]
    }
  },
  darkMode: 'class',
  plugins: [],
}
