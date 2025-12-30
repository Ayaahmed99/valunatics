/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#0ec17c',
          violetLight: '#2a008d',
          violetDark: '#170454',
          dark: '#040015',
        },
      },
    },
  },
  plugins: [],
};
