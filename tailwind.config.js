/** @type {import('tailwindcss').Config} */
const { nextui } = require('@nextui-org/react');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'sidebar-md': '250px auto',
        'sidebar-sm': 'w-[100%] auto',
        'sidebar-collapsed': '64px auto',
      },
      colors: {},
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
