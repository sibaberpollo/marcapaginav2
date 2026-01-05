import type { Metadata } from 'next';
import HoroscopoClient from '@/components/horoscope/HoroscopoClient';

export const metadata: Metadata = {
  title: 'Horóscopo Leo - H.P. Lovecraft: Agosto 2025 | Marcapágina',
  description:
    'Archivo del horóscopo literario de Leo: H.P. Lovecraft fue nuestra guía en agosto. Descubre qué dijeron los astros sobre tu lectura, escritura y vida literaria.',
  openGraph: {
    title: 'Horóscopo Leo - H.P. Lovecraft: Agosto 2025',
    description:
      'Archivo del horóscopo literario de Leo: H.P. Lovecraft fue nuestra guía en agosto.',
    images: [
      {
        url: 'https://res.cloudinary.com/dx98vnos1/image/upload/v1753183953/Leo_Lovecraft_tahvd6.png',
        width: 1200,
        height: 630,
        alt: 'Horóscopo Leo - H.P. Lovecraft',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Horóscopo Leo - H.P. Lovecraft: Agosto 2025',
    description: 'Archivo del horóscopo literario de Leo: H.P. Lovecraft fue nuestra guía.',
    images: ['https://res.cloudinary.com/dx98vnos1/image/upload/v1753183953/Leo_Lovecraft_tahvd6.png'],
  },
};

export default function HoroscopoLeoPage() {
  return (
    <main className="min-h-screen pt-14">
      <HoroscopoClient signo="leo" />
    </main>
  );
}
