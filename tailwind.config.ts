import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#080A0D",
        charcoal: "#14181F",
        steel: "#242B35",
        concrete: "#F3F4F2",
        "near-black": "#080A0D",
        "steel-grey": "#343B46",
        "safety-orange": "#F97316",
        "orange-hover": "#EA580C",
        "orange-text-light": "#C2410C",
        "text-dark": "#111827",
        "text-body": "#334155",
        "text-muted": "#64748B",
        "text-light": "#FFFFFF",
        "text-light-muted": "#CBD5E1",
        "border-dark": "#343B46",
        "border-light": "#E2E5E9",
        "off-white": "#FFFFFF",
      },
      fontFamily: {
        bebas: ["var(--font-bebas)", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      maxWidth: {
        site: "1360px",
      },
    },
  },
  plugins: [],
} satisfies Config;
