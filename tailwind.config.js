/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customGray: "#2A2A2A",
        customBlue: "#3B82F6",
        customBlueLight: "#2E5698",
      },
    },
  },
  plugins: [],
};
