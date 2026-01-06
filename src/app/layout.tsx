import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header, MobileNav, MobileAnchorAd } from '@/components';
import OrganizationSchema from '@/components/seo/OrganizationSchema';
import NavigationSchema from '@/components/seo/NavigationSchema';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcapagina.net';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Marcapágina — Revista de Literatura',
    template: '%s | Marcapágina',
  },
  description: 'Revista independiente de literatura. Publicamos narrativa inédita, noticias del sector editorial y recursos para lectores y escritores.',
  keywords: ['literatura', 'revista literaria', 'cuentos', 'relatos', 'narrativa', 'poesía', 'reseñas literarias', 'escritores', 'lectores'],
  authors: [{ name: 'Marcapágina' }],
  creator: 'Marcapágina',
  publisher: 'Marcapágina',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: siteUrl,
    siteName: 'Marcapágina',
    title: 'Marcapágina — Revista de Literatura',
    description: 'Revista independiente de literatura. Publicamos narrativa inédita, noticias del sector editorial y recursos para lectores y escritores.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Marcapágina — Revista de Literatura',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marcapágina — Revista de Literatura',
    description: 'Revista independiente de literatura. Publicamos narrativa inédita, noticias del sector editorial y recursos para lectores y escritores.',
    images: ['/og-image.png'],
    creator: '@marcapaginanet',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    // Añadir cuando tengas los códigos de verificación:
    // google: 'tu-codigo-de-google',
    // yandex: 'tu-codigo-de-yandex',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-theme="light">
      <head>
        <meta name="google-adsense-account" content="ca-pub-1422077668654301" />
        <OrganizationSchema />
        <NavigationSchema />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-bg-page text-text-primary`}>
        <GoogleAnalytics />
        <Header />
        {children}
        <MobileAnchorAd />
        <MobileNav />
      </body>
    </html>
  );
}
