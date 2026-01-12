// Types for the novel preview system

export interface PreviewAuthor {
  name: string;
  handle?: string;
  bio?: string;
  avatar?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    gumroad?: string;
  };
}

export interface Chapter {
  number: number;
  title?: string;
  subtitle?: string; // e.g., "1 de enero de 2015"
  pov?: string; // Point of view character name
  content: string; // HTML content
}

export interface NovelPreview {
  slug: string;
  title: string;
  author: PreviewAuthor;
  synopsis: string; // HTML content
  coverImage?: string;
  genre: string[];
  publishedAt: string; // ISO date string
  purchaseUrl: string; // Gumroad, Amazon, etc.
  purchaseLabel?: string; // "Comprar en Gumroad", etc.
  chapters: Chapter[];
  disclaimer?: string;
  accentColor?: string; // Custom accent for the landing (e.g., "red-900" for noir)
}

export interface PreviewSummary {
  slug: string;
  title: string;
  author: Pick<PreviewAuthor, 'name' | 'avatar'>;
  synopsis: string; // Plain text excerpt
  coverImage?: string;
  genre: string[];
  publishedAt: string;
  chapterCount: number;
}
