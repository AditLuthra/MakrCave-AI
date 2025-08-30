import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'MakrCave - Makerspace Management Portal',
    template: '%s | MakrCave',
  },
  description: 'Advanced makerspace management portal for MakrX ecosystem',
  keywords: ['makerspace', 'management', 'makrx', 'equipment', 'reservations', 'inventory'],
  authors: [{ name: 'MakrX Team' }],
  creator: 'MakrX',
  publisher: 'MakrX',
  robots: {
    index: false, // Private application
    follow: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-x-hidden`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
