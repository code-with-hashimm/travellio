import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        black: "#000000",
        teal: "#033d4a",
        "teal-deep": "#012830",
        cream: "#faf8f0",
        "gray-body": "#191919",
        "gray-muted": "#545454",
        "gray-border": "#cccccc",
        "glass-dark": "rgba(5,5,5,0.35)",
        "glass-white": "rgba(255,255,255,0.2)",
        "surface-dark": "#0d1117",
        "code-bg": "#161b22",
        "accent-cyan": "#00d4ff",
        "accent-green": "#00ff88",
        "accent-amber": "#ffaa00"
      },
      borderRadius: {
        pill: "48px",
        card: "24px",
        navpill: "60px"
      },
      fontFamily: {
        display: ["var(--font-cal-sans)", "system-ui", "sans-serif"],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace']
      },
      boxShadow: {
        card: "10px 11px 13px rgba(0,0,0,0.4)",
        "cyan-glow": "0 0 20px rgba(0,212,255,0.3)",
        "cyan-glow-lg": "0 0 30px rgba(0,212,255,0.4)"
      }
    }
  },
  plugins: []
};

export default config;
