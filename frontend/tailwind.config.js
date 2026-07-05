/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff8ff",
          100: "#dbeefe",
          500: "#2f8fef",
          600: "#1d6fd6",
          700: "#1a5cb0",
        },
      },
    },
  },
  plugins: [],
};
