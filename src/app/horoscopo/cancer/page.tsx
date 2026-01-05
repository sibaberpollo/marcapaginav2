import type { Metadata } from 'next';
import HoroscopoClient from '@/components/horoscope/HoroscopoClient';

export const metadata: Metadata = {
  title: 'Horóscopo Cáncer - Franz Kafka: Julio 2025 | Marcapágina',
  description:
    'Archivo del horóscopo literario de Cáncer: Franz Kafka fue nuestra guía en julio. Descubre qué dijeron los astros sobre tu lectura, escritura y vida literaria.',
  openGraph: {
    title: 'Horóscopo Cáncer - Franz Kafka: Julio 2025',
    description:
      'Archivo del horóscopo literario de Cáncer: Franz Kafka fue nuestra guía en julio.',
    images: [
      {
        url: 'https://res.cloudinary.com/dx98vnos1/image/upload/v1752236442/Kafka_cancer_qeyz7p.png',
        width: 1200,
        height: 630,
        alt: 'Horóscopo Cáncer - Franz Kafka',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Horóscopo Cáncer - Franz Kafka: Julio 2025',
    description: 'Archivo del horóscopo literario de Cáncer: Franz Kafka fue nuestra guía.',
    images: ['https://res.cloudinary.com/dx98vnos1/image/upload/v1752236442/Kafka_cancer_qeyz7p.png'],
  },
};

export default function HoroscopoCancerPage() {
  return (
    <main className="min-h-screen pt-14">
      <HoroscopoClient signo="cancer" />
    </main>
  );
}
