import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 50: "#eef3fb", 100: "#d6e2f5", 200: "#aec5ea", 500: "#2a5db0", 600: "#1e4a96", 700: "#173b78", 800: "#102c5a", 900: "#0a1e40" },
        gold: { 400: "#ffc928", 500: "#f5b400", 600: "#c98f00" },
        cream: "#fffaf0",
      },
      fontFamily: {
        sans: ["'Be Vietnam Pro'", "system-ui", "sans-serif"],
        display: ["'Playfair Display'", "'Be Vietnam Pro'", "serif"],
      },
      boxShadow: { soft: "0 8px 30px rgba(8,42,46,.08)" },
    },
  },
  plugins: [],
};
export default config;
