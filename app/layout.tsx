import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, Sora } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MEMORY SEQUENCE | Neural Memory Experiment',
  description:
    'A short cognitive experiment designed to challenge visual working memory. Observe the pattern, then reproduce it precisely.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#020611',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${plexMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
