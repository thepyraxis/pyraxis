import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#020205",
        surface: "#0d0d18",
        card: "#08080f",
        border: "#1a1a2e",
        purple: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          vivid: "#5800D0",
        },
        ink: {
          100: "#f8f8ff",
          200: "#e8e8f0",
          300: "#c8c8d8",
          400: "#a0a0b8",
          600: "#7a7a90",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "Syne", "sans-serif"],
      },
      gridTemplateColumns: {
        split: "380px 1fr",
      },
    },
  },
  plugins: [],
};

export default config;
