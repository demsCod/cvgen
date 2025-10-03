/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f1f5ff",
          100: "#dce7ff",
          200: "#b6ceff",
          300: "#85adff",
          400: "#5e8fff",
          500: "#3d6eff",
          600: "#1f4cff",
          700: "#143ae5",
          800: "#122fb4",
          900: "#111f73"
        }
      }
    }
  },
  plugins: []
};
