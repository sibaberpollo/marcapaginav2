import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header, MobileNav, MobileAnchorAd } from '@/components';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Marcapágina — Revista de Literatura',
  description: 'Revista independiente de literatura. Publicamos narrativa inédita, noticias del sector editorial y recursos para lectores y escritores.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-theme="light">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-bg-page text-text-primary`}>
        <Header />
        {children}
        <MobileAnchorAd />
        <MobileNav />
      </body>
    </html>
  );
}
