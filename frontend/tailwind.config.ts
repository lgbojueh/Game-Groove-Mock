// tailwind.config.js
import type { Config } from "tailwindcss";

const config: Config = {
  // ← enable "dark:" variants via a `.dark` class on <html> or <body>
  darkMode: ['class'],

  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
