import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17231d",
        cream: "#f7f3ea",
        sandal: "#d9b875",
        brass: "#b88a3b",
        leaf: "#1f4b38",
        vermilion: "#a6402d",
        mist: "#ebe6d9"
      },
      boxShadow: {
        luxe: "0 24px 60px rgba(31, 75, 56, 0.13)",
        soft: "0 12px 40px rgba(23, 35, 29, 0.08)"
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        display: ["var(--font-cormorant)", "serif"]
      },
      backgroundImage: {
        "aura-radial":
          "radial-gradient(circle at 20% 0%, rgba(217,184,117,.22), transparent 38%), radial-gradient(circle at 90% 20%, rgba(31,75,56,.12), transparent 32%)"
      }
    }
  },
  plugins: []
};

export default config;
