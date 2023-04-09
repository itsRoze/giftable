/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        check: 'url(/images/check.svg)',
      },
      fontFamily: {
        cookie: ['var(--font-cookie)', ...fontFamily.sans],
      },
    },
  },
};
