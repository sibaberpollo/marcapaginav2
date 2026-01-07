import fs from "fs/promises";
import path from "path";
import { Article, ArticleSummary, CATEGORIES, Category } from "./types/article";
import { fetchSanity } from "./sanity";

// Re-export types and constants for convenience
export { CATEGORIES, isTravelGuide } from "./types/article";
export type {
  Article,
  ArticleSummary,
  Category,
  TravelGuide,
  Location,
} from "./types/article";

// Base path for content
const CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * Ensures the content directory structure exists
 */
export async function ensureContentDirectories(): Promise<void> {
  // Create base content directory
  await fs.mkdir(CONTENT_DIR, { recursive: true });

  // Create category subdirectories
  for (const category of CATEGORIES) {
    const categoryDir = path.join(CONTENT_DIR, category.slug);
    await fs.mkdir(categoryDir, { recursive: true });
  }
}

/**
 * Get all articles from all categories
 */
export async function getAllArticles(): Promise<ArticleSummary[]> {
  const articles: ArticleSummary[] = [];

  try {
    await ensureContentDirectories();

    for (const category of CATEGORIES) {
      const categoryArticles = await getArticlesByCategory(category.slug);
      articles.push(...categoryArticles);
    }

    // Sort by published date (newest first)
    articles.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

    return articles;
  } catch (error) {
    console.error("Error getting all articles:", error);
    return [];
  }
}

/**
 * Get articles by category
 */
export async function getArticlesByCategory(
  categorySlug: string,
): Promise<ArticleSummary[]> {
  const categoryDir = path.join(CONTENT_DIR, categorySlug);

  try {
    await fs.mkdir(categoryDir, { recursive: true });
    const files = await fs.readdir(categoryDir);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const articles: ArticleSummary[] = [];

    for (const file of jsonFiles) {
      try {
        const filePath = path.join(categoryDir, file);
        const content = await fs.readFile(filePath, "utf-8");
        const article: Article = JSON.parse(content);

        // Return summary (without full content)
        articles.push({
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
        });
      } catch (fileError) {
        console.error(`Error reading article file ${file}:`, fileError);
      }
    }

    // Sort by published date (newest first)
    articles.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

    return articles;
  } catch (error) {
    console.error(
      `Error getting articles for category ${categorySlug}:`,
      error,
    );
    return [];
  }
}

/**
 * Get a single article by slug (searches all categories)
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    await ensureContentDirectories();

    for (const category of CATEGORIES) {
      const filePath = path.join(CONTENT_DIR, category.slug, `${slug}.json`);

      try {
        const content = await fs.readFile(filePath, "utf-8");
        return JSON.parse(content) as Article;
      } catch {
        // File not found in this category, continue searching
        continue;
      }
    }

    // Fallback: buscar en Sanity (Transtextos)
    // Fallback: buscar en Sanity (Transtextos)
    const sanityArticle = await getSanityArticleBySlug(slug);
    if (sanityArticle) {
      return sanityArticle;
    }

    return null;
  } catch (error) {
    console.error(`Error getting article ${slug}:`, error);
    return null;
  }
}

/**
 * Get a single article by category and slug
 */
export async function getArticleByCategoryAndSlug(
  categorySlug: string,
  slug: string,
): Promise<Article | null> {
  const filePath = path.join(CONTENT_DIR, categorySlug, `${slug}.json`);

  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as Article;
  } catch {
    return null;
  }
}

/**
 * Save an article
 */
export async function saveArticle(article: Article): Promise<boolean> {
  try {
    await ensureContentDirectories();

    const filePath = path.join(
      CONTENT_DIR,
      article.categorySlug,
      `${article.slug}.json`,
    );
    await fs.writeFile(filePath, JSON.stringify(article, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error(`Error saving article ${article.slug}:`, error);
    return false;
  }
}

/**
 * Delete an article
 */
export async function deleteArticle(
  categorySlug: string,
  slug: string,
): Promise<boolean> {
  const filePath = path.join(CONTENT_DIR, categorySlug, `${slug}.json`);

  try {
    await fs.unlink(filePath);
    return true;
  } catch {
    return false;
  }
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
      const articles = await getArticlesByCategory(category.slug);
      return { ...category, count: articles.length };
    }),
  );

  return categoriesWithCounts;
}

/**
 * Get a Sanity relato article by slug (from both MarcaPágina and Transtextos sites)
 */
async function getSanityArticleBySlug(slug: string): Promise<Article | null> {
  try {
    // Query specifically for relato documents with the given slug
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
        handle: result.author?.handle ? `@${result.author.handle}` : defaultAuthor.handle,
        avatar: "bg-brand-gray",
      },
      category: result.category || (isTranstextos ? "Transtextos" : "Relato"),
      categorySlug: result.categorySlug || (isTranstextos ? "transtextos" : "relatos"),
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
    // Get all published relatos from both sites:
    // - MarcaPágina relatos: site is undefined OR site slug is not "transtextos"
    // - Transtextos relatos: site->slug.current == "transtextos"
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
    .join("\n\n"); // separa más los párrafos en el HTML
}
