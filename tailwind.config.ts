import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./services/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#b9e0fe",
          300: "#7cc4fd",
          400: "#36a3fa",
          500: "#0c87eb",
          600: "#026ac9",
          700: "#0354a2",
          800: "#074785",
          900: "#0c3c6e",
          950: "#082649"
        },
        navy: {
          950: "rgb(var(--navy-950-rgb) / <alpha-value>)",
          900: "rgb(var(--navy-900-rgb) / <alpha-value>)",
          850: "rgb(var(--navy-850-rgb) / <alpha-value>)",
          800: "rgb(var(--navy-800-rgb) / <alpha-value>)",
          750: "rgb(var(--navy-750-rgb) / <alpha-value>)",
          700: "rgb(var(--navy-700-rgb) / <alpha-value>)",
          600: "rgb(var(--navy-600-rgb) / <alpha-value>)"
        },
        slate: {
          50: "rgb(var(--slate-50-rgb) / <alpha-value>)",
          100: "rgb(var(--slate-100-rgb) / <alpha-value>)",
          200: "rgb(var(--slate-200-rgb) / <alpha-value>)",
          300: "rgb(var(--slate-300-rgb) / <alpha-value>)",
          400: "rgb(var(--slate-400-rgb) / <alpha-value>)",
          500: "rgb(var(--slate-500-rgb) / <alpha-value>)",
          600: "rgb(var(--slate-600-rgb) / <alpha-value>)",
          700: "rgb(var(--slate-700-rgb) / <alpha-value>)",
          800: "rgb(var(--slate-800-rgb) / <alpha-value>)",
          900: "rgb(var(--slate-900-rgb) / <alpha-value>)",
          950: "rgb(var(--slate-950-rgb) / <alpha-value>)"
        },
        gold: {
          50: "rgb(var(--gold-50-rgb) / <alpha-value>)",
          100: "rgb(var(--gold-100-rgb) / <alpha-value>)",
          200: "rgb(var(--gold-200-rgb) / <alpha-value>)",
          300: "rgb(var(--gold-300-rgb) / <alpha-value>)",
          400: "rgb(var(--gold-400-rgb) / <alpha-value>)",
          500: "rgb(var(--gold-500-rgb) / <alpha-value>)",
          600: "rgb(var(--gold-600-rgb) / <alpha-value>)",
          700: "#C98C12",
          800: "#9E6B08",
          900: "#7A5207"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(0, 0, 0, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
