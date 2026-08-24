import type { Config } from "tailwindcss";
import { typography } from "./styles/tokens/typography";
import { spacing } from "./styles/tokens/spacing";
import { layout, breakpoints } from "./styles/tokens/layout";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    screens: {
      xs: `${breakpoints.xs}px`,
      sm: `${breakpoints.sm}px`,
      md: `${breakpoints.md}px`,
      lg: `${breakpoints.lg}px`,
      xl: `${breakpoints.xl}px`,
      "2xl": `${breakpoints["2xl"]}px`,
      "3xl": `${breakpoints["3xl"]}px`,
    },
    extend: {
      colors: {
        bg: "#050506",
        surface: "#08080B",
        card: "#0B0B0F",
        border: "#1a1a1c",
        purple: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          vivid: "#5800D0",
        },
        ink: {
          100: "#F2F0EB",
          200: "#d9d6cf",
          300: "#A8A5AD",
          400: "#8a8791",
          600: "#68666E",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "Syne", "sans-serif"],
      },
      fontSize: {
        display: typography.display,
        h1: typography.h1,
        h2: typography.h2,
        h3: typography.h3,
        body: typography.body,
        small: typography.small,
        "nav-mobile": layout.navMobileLinkSize,
        "hero-headline": typography.heroHeadline,
      },
      spacing: {
        xs: spacing.xs,
        sm: spacing.sm,
        md: spacing.md,
        lg: spacing.lg,
        xl: spacing.xl,
        "section-y": spacing.sectionY,
        header: layout.headerPaddingX,
      },
      maxWidth: {
        container: layout.containerMaxWidth,
      },
      gridTemplateColumns: {
        split: "380px 1fr",
      },
    },
  },
  plugins: [],
};

export default config;
