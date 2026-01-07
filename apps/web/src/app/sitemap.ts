import { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/articles';
import { fetchSanity } from '@/lib/sanity';
import { implementedSigns } from '@/lib/horoscope-data';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcapagina.page';

type SitemapEntry = {
  url: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
};

/**
 * Get all relatos from Sanity (both Transtextos and MarcaPágina sites)
 */
async function getAllRelatos(): Promise<{ slug: string; date: string }[]> {
  try {
    const query = `*[_type == "relato" && status == "published" && defined(slug.current)]{
      "slug": slug.current,
      "date": coalesce(date, publishedAt, _createdAt)
    }`;

    const result = await fetchSanity<{ slug: string; date: string }[]>(query);
    return result || [];
  } catch (error) {
    console.error('Error fetching relatos for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: SitemapEntry[] = [];

  // ===== PÁGINAS ESTÁTICAS =====

  // Homepage
  entries.push({
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  });

  // Transtextos feed
  entries.push({
    url: `${BASE_URL}/transtextos`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  });

  // Transtextos autores
  entries.push({
    url: `${BASE_URL}/transtextos/autores`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  });

  // ===== HORÓSCOPO =====

  // Horóscopo principal (signo actual)
  entries.push({
    url: `${BASE_URL}/horoscopo`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  });

  // Signos implementados (archivos)
  for (const signo of implementedSigns) {
    if (signo !== 'sagitario') { // sagitario es la página principal
      entries.push({
        url: `${BASE_URL}/horoscopo/${signo}`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.6,
      });
    }
  }

  // ===== ARTÍCULOS LOCALES =====

  try {
    const articles = await getAllArticles();

    for (const article of articles) {
      entries.push({
        url: `${BASE_URL}/articulo/${article.slug}`,
        lastModified: new Date(article.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error);
  }

  // ===== RELATOS (SANITY - Transtextos y MarcaPágina) =====

  try {
    const relatos = await getAllRelatos();

    for (const relato of relatos) {
      if (relato.slug) {
        entries.push({
          url: `${BASE_URL}/relato/${relato.slug}`,
          lastModified: relato.date ? new Date(relato.date) : new Date(),
          changeFrequency: 'yearly',
          priority: 0.6,
        });
      }
    }
  } catch (error) {
    console.error('Error fetching relatos for sitemap:', error);
  }

  return entries;
}
