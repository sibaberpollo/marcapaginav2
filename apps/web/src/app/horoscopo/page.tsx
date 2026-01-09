import type { Metadata } from 'next';
import HoroscopoClient from '@/components/horoscope/HoroscopoClient';

export const metadata: Metadata = {
  title: 'Horóscopo Capricornio - Edgar Allan Poe: Enero 2026 | Marcapágina',
  description:
    'Horóscopo literario de Capricornio: Edgar Allan Poe es nuestra guía. Descubre qué dicen los astros sobre tu lectura, escritura y vida literaria este mes.',
  openGraph: {
    title: 'Horóscopo Capricornio - Edgar Allan Poe: Enero 2026',
    description:
      'Horóscopo literario de Capricornio: Edgar Allan Poe es nuestra guía. Descubre qué dicen los astros sobre tu lectura, escritura y vida literaria este mes.',
    images: [
      {
        url: 'https://res.cloudinary.com/dx98vnos1/image/upload/v1767953685/Poe_bejcvr.png',
        width: 1200,
        height: 630,
        alt: 'Horóscopo Capricornio - Edgar Allan Poe',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Horóscopo Capricornio - Edgar Allan Poe: Enero 2026',
    description:
      'Horóscopo literario de Capricornio: Edgar Allan Poe es nuestra guía.',
    images: ['https://res.cloudinary.com/dx98vnos1/image/upload/v1767953685/Poe_bejcvr.png'],
  },
};

export default function HoroscopoPage() {
  return (
    <main className="min-h-screen">
      <HoroscopoClient signo="capricornio" />
    </main>
  );
}
