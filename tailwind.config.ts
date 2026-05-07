import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#243447",
        mist: "#f8f4ff",
        line: "#eadff5",
        brand: "#8b7cf6",
        success: "#3f8f73",
        warning: "#c0842f",
        danger: "#d45d6c",
        blush: "#fff1f5",
        lavender: "#f1edff",
        mint: "#effaf5",
        skysoft: "#eef7ff",
        peach: "#fff4e8"
      },
      boxShadow: {
        soft: "0 16px 45px rgba(139, 124, 246, 0.14)"
      }
    }
  },
  plugins: [forms]
};

export default config;
