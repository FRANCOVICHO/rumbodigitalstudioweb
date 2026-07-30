import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
          DEFAULT: "#7c3aed",
        },
        secondary: {
          50: "#fdf4ff",
          100: "#fae8ff",
          200: "#f5d0fe",
          300: "#f0abfc",
          400: "#e879f9",
          500: "#d946ef",
          600: "#c026d3",
          700: "#a21caf",
          800: "#86198f",
          900: "#701a75",
          950: "#4a044e",
          DEFAULT: "#a855f7",
        },
        accent: {
          DEFAULT: "#06b6d4",
          light: "#67e8f9",
          dark: "#0e7490",
        },
        background: {
          DEFAULT: "#0a0a0f",
          secondary: "#111118",
          tertiary: "#1a1a2e",
          card: "rgba(255,255,255,0.04)",
        },
        foreground: {
          DEFAULT: "#f8fafc",
          muted: "#94a3b8",
          subtle: "#64748b",
        },
        border: {
          DEFAULT: "rgba(139,92,246,0.2)",
          muted: "rgba(255,255,255,0.08)",
          strong: "rgba(139,92,246,0.5)",
        },
        glass: {
          DEFAULT: "rgba(255,255,255,0.05)",
          strong: "rgba(255,255,255,0.1)",
        },
        matrix: {
          bg: "#001100",
          text: "#00ff41",
          glow: "#00cc33",
        },
        party: {
          pink: "#ff006e",
          yellow: "#ffbe0b",
          cyan: "#00f5ff",
          orange: "#fb5607",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #06b6d4 100%)",
        "gradient-dark": "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)",
        "gradient-glass": "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
        "gradient-glow": "radial-gradient(ellipse at center, rgba(124,58,237,0.3) 0%, transparent 70%)",
        "gradient-blob": "radial-gradient(circle at 50% 50%, rgba(124,58,237,0.4) 0%, rgba(168,85,247,0.2) 50%, transparent 70%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(124,58,237,0.5)",
        "glow-lg": "0 0 40px rgba(124,58,237,0.6), 0 0 80px rgba(124,58,237,0.3)",
        "glow-sm": "0 0 10px rgba(124,58,237,0.4)",
        "glow-cyan": "0 0 20px rgba(6,182,212,0.5)",
        "glow-pink": "0 0 20px rgba(255,0,110,0.5)",
        glass: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
        "glass-sm": "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
        card: "0 4px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        blob: "blob 7s infinite",
        "blob-slow": "blob 12s infinite",
        particle: "particle 8s infinite linear",
        glow: "glow 2s ease-in-out infinite alternate",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 10s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "fade-up": "fade-up 0.5s ease-out forwards",
        "slide-in-left": "slide-in-left 0.4s ease-out forwards",
        "slide-in-right": "slide-in-right 0.4s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
        "spin-slow": "spin 8s linear infinite",
        "matrix-rain": "matrix-rain 0.1s step-end infinite",
        "party-pulse": "party-pulse 0.5s ease-in-out infinite alternate",
        "gradient-x": "gradient-x 5s ease infinite",
        "gradient-y": "gradient-y 5s ease infinite",
        "gradient-xy": "gradient-xy 5s ease infinite",
        typing: "typing 3.5s steps(40, end) forwards",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        particle: {
          "0%": { transform: "translateY(100vh) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(-100vh) rotate(720deg)", opacity: "0" },
        },
        glow: {
          from: { boxShadow: "0 0 10px rgba(124,58,237,0.3)" },
          to: { boxShadow: "0 0 30px rgba(124,58,237,0.8), 0 0 60px rgba(168,85,247,0.4)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% center" },
          to: { backgroundPosition: "200% center" },
        },
        "matrix-rain": {
          "0%": { opacity: "1" },
          "50%": { opacity: "0.5" },
          "100%": { opacity: "1" },
        },
        "party-pulse": {
          from: { filter: "hue-rotate(0deg) saturate(1)" },
          to: { filter: "hue-rotate(360deg) saturate(2)" },
        },
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        "gradient-y": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "center top",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "center center",
          },
        },
        "gradient-xy": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        typing: {
          from: { width: "0" },
          to: { width: "100%" },
        },
      },
      transitionDuration: {
        "400": "400ms",
      },
    },
  },
  plugins: [],
};

export default config;
