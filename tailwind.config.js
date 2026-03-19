/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,scss}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0a2240', light: '#0d2d57', mid: '#163a6b' },
        saffron: { DEFAULT: '#f4811e', light: '#fca44d' },
        govgreen: { DEFAULT: '#138808', light: '#1aa80a' },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Noto Serif', 'serif'],
      },
    },
  },
  plugins: [],
};
