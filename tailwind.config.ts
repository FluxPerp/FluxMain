import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#09090b",
        surface: "#0d0d0f",
        surface2: "#111113",
        border: "#1a1a1c",
        border2: "#222226",
        muted: "#52525b",
        muted2: "#71717a",
        text: "#fafafa",
        text2: "#a1a1aa",
        green: "#22c55e",
        cyan: "#38bdf8",
        red: "#ff4d4d",
        orange: "#ff8c00",
        purple: "#c084fc",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
        sans: ["Inter", "ui-sans-serif", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
