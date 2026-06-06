/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./Main.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
