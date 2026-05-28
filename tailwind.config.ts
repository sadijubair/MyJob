import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
    "./collections/**/*.{ts,tsx,js,jsx,mdx}",
    "./lib/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          DEFAULT: "#e11d48",
          light: "#fff1f2",
          mid: "#fda4af",
          dark: "#9f1239",
        },
        ink: {
          DEFAULT: "#0f0a0a",
          2: "#3d2929",
          3: "#78716c",
        },
        surface: "#fffaf9",
        card: "#ffffff",
        "border-card": "#f3d0d7",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
    },
  },
}

export default config