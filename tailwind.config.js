/** @type {import('tailwindcss').Config} */
module.exports = {
  future: {
    disableColorFunction: true, // 👈 this line disables oklch()
  },
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {},
  },
  plugins: [],
};
