/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        default: ["var(--font-inter)"],
        serif: ["Lora", "Georgia", "serif"],
        chinese: ["var(--font-noto-serif-sc)", "'Noto Serif SC'", "serif"],
      },
      colors: {
        ink: "var(--text)",
        muted: "var(--text-muted)",
        accent: "var(--accent)",
        jade: "var(--jade)",
        canvas: "var(--bg)",
      },
    },
  },
  plugins: [],
}
