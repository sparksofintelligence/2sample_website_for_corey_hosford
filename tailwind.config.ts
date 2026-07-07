import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--bg)",
        surface: "var(--surface)",
        ink: "var(--text)",
        muted: "var(--muted)",
        rule: "var(--border)",
        steel: "var(--steel)",
        footer: "var(--footer)",
      },
      fontFamily: {
        sans: ["var(--font-barlow)", "Barlow", "sans-serif"],
        display: ["var(--font-archivo)", "Archivo", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
