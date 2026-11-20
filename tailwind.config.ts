import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: {
      emerald: { 950: "#0C2620", 900: "#12362B", 700: "#1D5C48", 600: "#26735A" },
      gold: { 500: "#C19A3D", 600: "#A8842F" },
      beige: { 50: "#FAF6EE", 100: "#F3ECDC" },
      sage: { 100: "#E6EAE0" }, cream: "#FFFDF8", ink: "#1A211E", moss: "#56624F",
    },
    fontFamily: {
      display: ['"Fraunces Variable"', "Georgia", "serif"],
      sans: ['"Inter Variable"', "system-ui", "sans-serif"],
    },
  } },
  plugins: [],
} satisfies Config;
