import { NovelPreview, PreviewSummary } from './types/preview';

// Base URL for fetching content from public/
const getContentBaseUrl = () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    return `${siteUrl}/content`;
  }
  return 'http://localhost:3000/content';
};

/**
 * Fetch a JSON file from public/content/previews/ via HTTP
 */
async function fetchPreviewJson<T>(path: string): Promise<T | null> {
  try {
    const url = `${getContentBaseUrl()}/previews/${path}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Fetch manifest file to get list of previews
 */
async function fetchPreviewManifest(): Promise<string[]> {
  const manifest = await fetchPreviewJson<{ files: string[] }>('_manifest.json');
  return manifest?.files || [];
}

/**
 * Convert NovelPreview to PreviewSummary
 */
function toSummary(preview: NovelPreview): PreviewSummary {
  // Strip HTML tags for plain text synopsis
  const plainSynopsis = preview.synopsis
    .replace(/<[^>]*>/g, '')
    .substring(0, 200)
    .trim() + '...';

  return {
    slug: preview.slug,
    title: preview.title,
    author: {
      name: preview.author.name,
      avatar: preview.author.avatar,
    },
    synopsis: plainSynopsis,
    coverImage: preview.coverImage,
    genre: preview.genre,
    publishedAt: preview.publishedAt,
    chapterCount: preview.chapters.length,
  };
}

/**
 * Get all novel previews
 */
export async function getAllPreviews(): Promise<PreviewSummary[]> {
  const files = await fetchPreviewManifest();
  const previews: PreviewSummary[] = [];

  for (const file of files) {
    const preview = await fetchPreviewJson<NovelPreview>(file);
    if (preview) {
      previews.push(toSummary(preview));
    }
  }

  // Sort by published date (newest first)
  previews.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return previews;
}

/**
 * Get a single preview by slug
 */
export async function getPreviewBySlug(slug: string): Promise<NovelPreview | null> {
  return fetchPreviewJson<NovelPreview>(`${slug}.json`);
}

/**
 * Get all preview slugs (for static generation)
 */
export async function getAllPreviewSlugs(): Promise<string[]> {
  const files = await fetchPreviewManifest();
  return files.map((file) => file.replace('.json', ''));
}

// Re-export types
export type { NovelPreview, PreviewSummary, Chapter, PreviewAuthor } from './types/preview';
