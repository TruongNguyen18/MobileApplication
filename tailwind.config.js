/** @type {import('tailwindcss').Config} */
module.exports = {
  // Trỏ đúng vào các file có chứa giao diện của bạn
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
