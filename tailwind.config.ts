import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        geist: ["var(--font-geist-sans)"],
        cinzel: ["Cinzel Decorative", "cursive"], // Simplified definition
      },
    },
  },
  plugins: [],
};

export default config;
