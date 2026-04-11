/** @type {import('tailwindcss').Config} */
const baseConfig = require('@farmhith/config/tailwind');

module.exports = {
  ...baseConfig,
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
};
