// Types for the horoscope system

export interface ZodiacSign {
  name: string;
  date: string;
  slug: string;
  symbol: string;
  image: string;
}

export interface Efemeride {
  date: string;
  title: string;
  description: string;
  color: string;
  borderColor: string;
  textColor: string;
}

export interface HoroscopoData {
  author: string;
  authorImage: string;
  authorCredit: string;
  authorSlug: string;
  description: string;
  efemerides: Efemeride[];
  writers?: string[];
}

export interface LiteraryText {
  text: string;
}

export type SignSlug = 'aries' | 'tauro' | 'geminis' | 'cancer' | 'leo' | 'virgo' | 'libra' | 'escorpio' | 'sagitario' | 'capricornio' | 'acuario' | 'piscis';

export type ImplementedSignSlug = 'cancer' | 'leo' | 'virgo' | 'libra' | 'escorpio' | 'sagitario';

export type LiteraryTexts = Record<SignSlug, LiteraryText>;
