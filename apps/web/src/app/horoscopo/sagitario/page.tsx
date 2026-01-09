import type { Metadata } from 'next';
import HoroscopoClient from '@/components/horoscope/HoroscopoClient';

export const metadata: Metadata = {
  title: 'Horóscopo Sagitario - Jane Austen: Diciembre 2025 | Marcapágina',
  description:
    'Archivo del horóscopo literario de Sagitario: Jane Austen fue nuestra guía en diciembre. Descubre qué dijeron los astros sobre tu lectura, escritura y vida literaria.',
  openGraph: {
    title: 'Horóscopo Sagitario - Jane Austen: Diciembre 2025',
    description:
      'Archivo del horóscopo literario de Sagitario: Jane Austen fue nuestra guía en diciembre.',
    images: [
      {
        url: 'https://res.cloudinary.com/dx98vnos1/image/upload/v1764592800/jane_austen_sagitario_q5ssic.png',
        width: 1200,
        height: 630,
        alt: 'Horóscopo Sagitario - Jane Austen',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Horóscopo Sagitario - Jane Austen: Diciembre 2025',
    description: 'Archivo del horóscopo literario de Sagitario: Jane Austen fue nuestra guía.',
    images: ['https://res.cloudinary.com/dx98vnos1/image/upload/v1764592800/jane_austen_sagitario_q5ssic.png'],
  },
};

export default function HoroscopoSagitarioPage() {
  return (
    <main className="min-h-screen">
      <HoroscopoClient signo="sagitario" />
    </main>
  );
}
