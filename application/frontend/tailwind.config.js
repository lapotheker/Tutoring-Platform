/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0f1221",
        text: "#e9ecff",
        muted: "#b9c0ff",
        uno: { red: "#e33b3b", yellow: "#f3c22f", green: "#31c26a", blue: "#2c7cf8" },
      },
      borderRadius: { "2xl": "1.25rem" },
      boxShadow: { soft: "0 14px 36px rgba(0,0,0,.28)" },
    },
  },
  plugins: [],
};
