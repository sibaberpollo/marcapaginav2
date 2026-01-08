import { Article, ArticleSummary, CATEGORIES, Category } from "./types/article";
import { fetchSanity } from "./sanity";

// Re-export types and constants for convenience
// TODO: Review if this re-export pattern is necessary or if direct imports are preferred
export { CATEGORIES, isTravelGuide } from "./types/article";
export type {
  Article,
  ArticleSummary,
  Category,
  TravelGuide,
  Location,
} from "./types/article";

// Base URL for fetching content from public/
const getContentBaseUrl = () => {
  // NEXT_PUBLIC_SITE_URL must be set in Vercel (e.g., https://marcapagina.page)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    return `${siteUrl}/content`;
  }
  // Fallback for local development
  return "http://localhost:3000/content";
};

// Convert Article to ArticleSummary
function toSummary(article: Article): ArticleSummary {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    author: {
      name: article.author.name,
      handle: article.author.handle,
      avatar: article.author.avatar,
    },
    category: article.category,
    categorySlug: article.categorySlug,
    tags: article.tags,
    featured: article.featured,
    publishedAt: article.publishedAt,
    readTime: article.readTime,
    likes: article.likes,
    comments: article.comments,
  };
}

/**
 * Fetch a JSON file from public/content/ via HTTP
 */
async function fetchContentJson<T>(path: string): Promise<T | null> {
  try {
    const url = `${getContentBaseUrl()}/${path}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Fetch manifest file to get list of articles in a category
 */
async function fetchCategoryManifest(categorySlug: string): Promise<string[]> {
  const manifest = await fetchContentJson<{ files: string[] }>(
    `${categorySlug}/_manifest.json`,
  );
  return manifest?.files || [];
}

/**
 * Get all articles from all categories
 */
export async function getAllArticles(): Promise<ArticleSummary[]> {
  const articles: ArticleSummary[] = [];

  for (const category of CATEGORIES) {
    const files = await fetchCategoryManifest(category.slug);

    for (const file of files) {
      const article = await fetchContentJson<Article>(
        `${category.slug}/${file}`,
      );
      if (article) {
        articles.push(toSummary(article));
      }
    }
  }

  // Sort by published date (newest first)
  articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return articles;
}

/**
 * Get a single article by slug (searches local articles then Sanity)
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  // Search in all categories
  for (const category of CATEGORIES) {
    const article = await fetchContentJson<Article>(
      `${category.slug}/${slug}.json`,
    );
    if (article) {
      return article;
    }
  }

  // Fallback: buscar en Sanity (Transtextos)
  const sanityArticle = await getSanityArticleBySlug(slug);
  if (sanityArticle) {
    return sanityArticle;
  }

  return null;
}

/**
 * Get featured articles
 */
export async function getFeaturedArticles(
  limit: number = 5,
): Promise<ArticleSummary[]> {
  const allArticles = await getAllArticles();
  return allArticles.filter((article) => article.featured).slice(0, limit);
}

/**
 * Get related articles (same category or tags)
 */
export async function getRelatedArticles(
  article: Article,
  limit: number = 4,
): Promise<ArticleSummary[]> {
  const allArticles = await getAllArticles();

  // Filter out the current article and find related ones
  const related = allArticles
    .filter((a) => a.slug !== article.slug)
    .map((a) => {
      let score = 0;
      // Same category = high score
      if (a.categorySlug === article.categorySlug) score += 10;
      // Matching tags
      const matchingTags = a.tags.filter((tag) => article.tags.includes(tag));
      score += matchingTags.length * 3;
      return { article: a, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.article);

  return related;
}

/**
 * Get all categories with article counts
 */
export async function getCategoriesWithCounts(): Promise<
  (Category & { count: number })[]
> {
  const categoriesWithCounts = await Promise.all(
    CATEGORIES.map(async (category) => {
      const files = await fetchCategoryManifest(category.slug);
      return { ...category, count: files.length };
    }),
  );

  return categoriesWithCounts;
}

/**
 * Get a Sanity relato article by slug (from both MarcaPágina and Transtextos sites)
 */
async function getSanityArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const query = `*[_type == "relato" && slug.current == $slug && status == "published"][0]{
            "slug": slug.current,
            title,
            "excerpt": coalesce(summary, excerpt, description, seoDescription, lead, ""),
            "content": coalesce(
                pt::text(body),
                pt::text(contenido),
                content,
                description,
                summary,
                excerpt,
                lead,
                ""
            ),
            "publishedAt": coalesce(date + "T00:00:00Z", publishedAt, _createdAt),
            "readTime": readTime,
            featured,
            likes,
            comments,
            "tags": coalesce(tags[]->title, tags),
            "category": coalesce(category->title, site->title, "Relato"),
            "categorySlug": coalesce(category->slug.current, site->slug.current, "relatos"),
            "author": coalesce(
                author->{name, "handle": slug.current},
                {"name": authorName, "handle": authorHandle},
                {"name": "MarcaPágina", "handle": "@marcapagina"}
            ),
            "siteSlug": site->slug.current
        }`;

    const result = await fetchSanity<{
      slug?: string;
      title?: string;
      excerpt?: string;
      content?: string;
      publishedAt?: string;
      readTime?: string;
      featured?: boolean;
      likes?: number;
      comments?: number;
      tags?: (string | null)[];
      category?: string;
      categorySlug?: string;
      author?: { name?: string; handle?: string };
      siteSlug?: string;
    }>(query, { slug });

    if (!result || !result.title) return null;

    const rawContent =
      typeof result.content === "string" && result.content.trim().length > 0
        ? result.content.trim()
        : "";

    const safeContent =
      rawContent.length > 0
        ? rawContent.includes("<")
          ? rawContent
          : formatPlainTextToHtml(rawContent)
        : `<p>${result.excerpt || ""}</p>`;

    // Determine if this is a Transtextos or MarcaPágina relato
    const isTranstextos = result.siteSlug === "transtextos";
    const defaultAuthor = isTranstextos
      ? { name: "Transtextos", handle: "@transtextos" }
      : { name: "MarcaPágina", handle: "@marcapagina" };

    return {
      slug: result.slug || slug,
      title: result.title,
      excerpt: result.excerpt || "",
      content: safeContent,
      author: {
        name: result.author?.name || defaultAuthor.name,
        handle: result.author?.handle
          ? `@${result.author.handle}`
          : defaultAuthor.handle,
        avatar: "bg-brand-gray",
      },
      category: result.category || (isTranstextos ? "Transtextos" : "Relato"),
      categorySlug:
        result.categorySlug || (isTranstextos ? "transtextos" : "relatos"),
      tags: (result.tags || []).filter((t): t is string =>
        Boolean(t && t.length > 0),
      ),
      featured: Boolean(result.featured),
      publishedAt: result.publishedAt || new Date().toISOString(),
      readTime: result.readTime || "5 min",
      likes: result.likes,
      comments: result.comments,
      type: "standard",
    };
  } catch (error) {
    console.error(`Error getting Sanity article ${slug}:`, error);
    return null;
  }
}

/**
 * Get all relato slugs from Sanity (both Transtextos and MarcaPágina sites)
 */
export async function getAllTranstextosSlugs(): Promise<string[]> {
  try {
    const query = `*[_type == "relato" && status == "published" && defined(slug.current)]{ "slug": slug.current }`;
    const result = await fetchSanity<Array<{ slug?: string }>>(query);
    return result
      .map((item) => item.slug)
      .filter((slug): slug is string => typeof slug === "string");
  } catch (error) {
    console.error("Error getting relato slugs:", error);
    return [];
  }
}

export function formatPlainTextToHtml(text: string): string {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (normalized.length === 0) return "";

  const paragraphs = normalized.split(/\n{2,}/).map((p) => p.trim());

  return paragraphs
    .map((p) => `<p>${p.replace(/\n/g, "<br />")}</p>`)
    .join("\n\n");
}
