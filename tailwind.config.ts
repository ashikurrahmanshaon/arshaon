import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/city/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        alabaster: {
          50: '#FAF9F6',
          100: '#F7F5F0',
          200: '#EFECE6',
          300: '#E4E0D8',
          400: '#D4CFC4',
        },
        charcoal: {
          800: '#27272A',
          900: '#18181B',
          950: '#0F0F12',
        },
        wood: {
          light: '#D4B996',
          DEFAULT: '#A67246',
          dark: '#8C5A32',
          walnut: '#5C3A21',
        },
        accent: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
