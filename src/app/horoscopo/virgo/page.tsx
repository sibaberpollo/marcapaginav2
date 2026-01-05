import type { Metadata } from 'next';
import HoroscopoClient from '@/components/horoscope/HoroscopoClient';

export const metadata: Metadata = {
  title: 'Horóscopo Virgo - Agatha Christie: Septiembre 2025 | Marcapágina',
  description:
    'Archivo del horóscopo literario de Virgo: Agatha Christie fue nuestra guía en septiembre. Descubre qué dijeron los astros sobre tu lectura, escritura y vida literaria.',
  openGraph: {
    title: 'Horóscopo Virgo - Agatha Christie: Septiembre 2025',
    description:
      'Archivo del horóscopo literario de Virgo: Agatha Christie fue nuestra guía en septiembre.',
    images: [
      {
        url: 'https://res.cloudinary.com/dx98vnos1/image/upload/v1755780888/Agatha-Christie_lzxfnz.png',
        width: 1200,
        height: 630,
        alt: 'Horóscopo Virgo - Agatha Christie',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Horóscopo Virgo - Agatha Christie: Septiembre 2025',
    description: 'Archivo del horóscopo literario de Virgo: Agatha Christie fue nuestra guía.',
    images: ['https://res.cloudinary.com/dx98vnos1/image/upload/v1755780888/Agatha-Christie_lzxfnz.png'],
  },
};

export default function HoroscopoVirgoPage() {
  return (
    <main className="min-h-screen pt-14">
      <HoroscopoClient signo="virgo" />
    </main>
  );
}
