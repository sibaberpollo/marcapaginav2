import type { Metadata } from 'next';
import HoroscopoClient from '@/components/horoscope/HoroscopoClient';

export const metadata: Metadata = {
  title: 'Horóscopo Escorpio - Patricia Highsmith: Noviembre 2025 | Marcapágina',
  description:
    'Archivo del horóscopo literario de Escorpio: Patricia Highsmith fue nuestra guía en noviembre. Descubre qué dijeron los astros sobre tu lectura, escritura y vida literaria.',
  openGraph: {
    title: 'Horóscopo Escorpio - Patricia Highsmith: Noviembre 2025',
    description:
      'Archivo del horóscopo literario de Escorpio: Patricia Highsmith fue nuestra guía en noviembre.',
    images: [
      {
        url: 'https://res.cloudinary.com/dx98vnos1/image/upload/v1761664881/Patricia_Highsmith_c0spde.png',
        width: 1200,
        height: 630,
        alt: 'Horóscopo Escorpio - Patricia Highsmith',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Horóscopo Escorpio - Patricia Highsmith: Noviembre 2025',
    description: 'Archivo del horóscopo literario de Escorpio: Patricia Highsmith fue nuestra guía.',
    images: ['https://res.cloudinary.com/dx98vnos1/image/upload/v1761664881/Patricia_Highsmith_c0spde.png'],
  },
};

export default function HoroscopoEscorpioPage() {
  return (
    <main className="min-h-screen pt-14">
      <HoroscopoClient signo="escorpio" />
    </main>
  );
}
