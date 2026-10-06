import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#020611',
        panel: '#07111F',
        hairline: '#16314D',
        signal: '#22D3EE',
        azure: '#38BDF8',
        pulse: '#8B5CF6',
        ice: '#E6F7FF',
        mute: '#8294AD',
        fault: '#FF5D7A',
      },
      fontFamily: {
        sans: ['var(--font-sora)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: [
          'var(--font-plex-mono)',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
};

export default config;
