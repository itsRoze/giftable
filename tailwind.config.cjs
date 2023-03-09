/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    backgroundImage: {
      'check': 'url(/images/check.svg)',
    },
    extend: {},
  },
  plugins: [require('daisyui')],
};
