/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        customGray: '#F2F2F7',
        customGray2: '#F7F7F7',
        customGray3: '#ECECEE',
        colorBase: '#C084FC',
        colorBase2: '#539DF3',
      }
    },
  },
  plugins: [],
};