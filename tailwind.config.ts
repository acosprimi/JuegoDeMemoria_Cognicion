import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8EC',
        paper: '#FFFDF8',
        blush: '#FFE6EF',
        pink: '#FFB7D2',
        rose: '#FF8CB5',
        lilac: '#DCCBFF',
        grape: '#B597F2',
        sky: '#C9EAFF',
        ocean: '#7CC4F2',
        butter: '#FFF1A8',
        sun: '#FFD54D',
        mint: '#CDF3E1',
        leaf: '#7ED6AB',
        cocoa: '#6B4A5E',
        mute: '#8A6B7D',
        coral: '#FF7C8E',
      },
      fontFamily: {
        sans: ['var(--font-nunito)', 'ui-rounded', 'system-ui', 'sans-serif'],
        display: ['var(--font-fredoka)', 'var(--font-nunito)', 'ui-rounded', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
