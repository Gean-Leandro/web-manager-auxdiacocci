/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
      colors: {
        mygray: {
          900: "#1B1A1A",
          800: "#3A3A3A",
          700: "#5B5B5B",
          600: "#8A8A8A",
          500: "#AFAFAF",
          400: "#CECECE",
          300: "#E2E2E2",
          200: "#F0F0F0",
        },
      },
    },
  },
  plugins: [],
}

