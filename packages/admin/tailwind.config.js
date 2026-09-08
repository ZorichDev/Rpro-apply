/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#C8102E", dark: "#A00E24" },
        ink: "#0A0A0A",
        ink2: "#2E2E2E",
        muted: "#6B6B6B",
        muted2: "#9A9A9A",
        line: "#EAEAEA",
        cream: "#FAFAF7",
        soft: "#F5F7FA",
        navy: { DEFAULT: "#0F2F4C", dark: "#183F62" },
        success: "#0F8A4D",
        info: "#0891B2",
      },
      fontFamily: {
        sans: ["Inter", "DM Sans", "sans-serif"],
        display: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
