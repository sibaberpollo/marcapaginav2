import fs from 'fs/promises';
import path from 'path';
import { Article, ArticleSummary, CATEGORIES, Category } from './types/article';

// Re-export types and constants for convenience
export { CATEGORIES } from './types/article';
export type { Article, ArticleSummary, Category } from './types/article';

// Base path for content
const CONTENT_DIR = path.join(process.cwd(), 'content', 'articles');

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
            (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );

        return articles;
    } catch (error) {
        console.error('Error getting all articles:', error);
        return [];
    }
}

/**
 * Get articles by category
 */
export async function getArticlesByCategory(categorySlug: string): Promise<ArticleSummary[]> {
    const categoryDir = path.join(CONTENT_DIR, categorySlug);

    try {
        await fs.mkdir(categoryDir, { recursive: true });
        const files = await fs.readdir(categoryDir);
        const jsonFiles = files.filter((file) => file.endsWith('.json'));

        const articles: ArticleSummary[] = [];

        for (const file of jsonFiles) {
            try {
                const filePath = path.join(categoryDir, file);
                const content = await fs.readFile(filePath, 'utf-8');
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
            (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );

        return articles;
    } catch (error) {
        console.error(`Error getting articles for category ${categorySlug}:`, error);
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
                const content = await fs.readFile(filePath, 'utf-8');
                return JSON.parse(content) as Article;
            } catch {
                // File not found in this category, continue searching
                continue;
            }
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
    slug: string
): Promise<Article | null> {
    const filePath = path.join(CONTENT_DIR, categorySlug, `${slug}.json`);

    try {
        const content = await fs.readFile(filePath, 'utf-8');
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

        const filePath = path.join(CONTENT_DIR, article.categorySlug, `${article.slug}.json`);
        await fs.writeFile(filePath, JSON.stringify(article, null, 2), 'utf-8');
        return true;
    } catch (error) {
        console.error(`Error saving article ${article.slug}:`, error);
        return false;
    }
}

/**
 * Delete an article
 */
export async function deleteArticle(categorySlug: string, slug: string): Promise<boolean> {
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
export async function getFeaturedArticles(limit: number = 5): Promise<ArticleSummary[]> {
    const allArticles = await getAllArticles();
    return allArticles.filter((article) => article.featured).slice(0, limit);
}

/**
 * Get related articles (same category or tags)
 */
export async function getRelatedArticles(
    article: Article,
    limit: number = 4
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
export async function getCategoriesWithCounts(): Promise<(Category & { count: number })[]> {
    const categoriesWithCounts = await Promise.all(
        CATEGORIES.map(async (category) => {
            const articles = await getArticlesByCategory(category.slug);
            return { ...category, count: articles.length };
        })
    );

    return categoriesWithCounts;
}
