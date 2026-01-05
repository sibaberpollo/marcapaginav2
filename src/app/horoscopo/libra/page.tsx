import type { Metadata } from 'next';
import HoroscopoClient from '@/components/horoscope/HoroscopoClient';

export const metadata: Metadata = {
  title: 'Horóscopo Libra - Oscar Wilde: Octubre 2025 | Marcapágina',
  description:
    'Archivo del horóscopo literario de Libra: Oscar Wilde fue nuestra guía en octubre. Descubre qué dijeron los astros sobre tu lectura, escritura y vida literaria.',
  openGraph: {
    title: 'Horóscopo Libra - Oscar Wilde: Octubre 2025',
    description:
      'Archivo del horóscopo literario de Libra: Oscar Wilde fue nuestra guía en octubre.',
    images: [
      {
        url: 'https://res.cloudinary.com/dx98vnos1/image/upload/v1758729122/Oscar_Wilde_Libra_s9czcr.png',
        width: 1200,
        height: 630,
        alt: 'Horóscopo Libra - Oscar Wilde',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Horóscopo Libra - Oscar Wilde: Octubre 2025',
    description: 'Archivo del horóscopo literario de Libra: Oscar Wilde fue nuestra guía.',
    images: ['https://res.cloudinary.com/dx98vnos1/image/upload/v1758729122/Oscar_Wilde_Libra_s9czcr.png'],
  },
};

export default function HoroscopoLibraPage() {
  return (
    <main className="min-h-screen pt-14">
      <HoroscopoClient signo="libra" />
    </main>
  );
}
