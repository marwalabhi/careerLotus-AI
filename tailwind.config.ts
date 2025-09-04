// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        lotus: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#DB87D4', // Primary lotus pink
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        'lotus-light': {
          50: '#fefcff',
          100: '#fdf9ff',
          200: '#F4BFC7', // Secondary lotus
          300: '#f1d5e7',
          400: '#ecbdd9',
          500: '#E6AAD4', // Accent
          600: '#d888c4',
          700: '#c766b4',
          800: '#b544a4',
          900: '#a32294',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
