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
          950: "#07131C",
          900: "#0D1B26",
          850: "#112433",
          800: "#162C3D",
          700: "#1E3448",
          600: "#243E56"
        },
        gold: {
          50: "#FEF9EE",
          100: "#FDF0D5",
          200: "#FBE1AB",
          300: "#F8D181",
          400: "#F6C557",
          500: "#F5B82E",
          600: "#E5A81F",
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
