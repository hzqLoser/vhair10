/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/index.html',
    './components/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx,vue}',
    './src/**/*.{html,wxml}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
