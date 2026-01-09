import Link from "next/link";
import { ArticleSummary } from "@/lib/types/article";
import Avatar from "./Avatar";

interface CategoryFeedProps {
  articles: ArticleSummary[];
  categoryName: string;
}

function formatTimeAgo(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "hace unos minutos";
  if (diffHours < 24) return `hace ${diffHours}h`;
  if (diffDays < 7) return `hace ${diffDays}d`;
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

function ArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <article className="bg-bg-primary rounded-lg p-5 border border-surface-2 hover:border-brand-gray/30 transition-colors">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Avatar name={article.author.name} size="xs" />
            <span className="text-sm font-medium">{article.author.name}</span>
            <span className="text-xs text-text-secondary">
              {formatTimeAgo(article.publishedAt)}
            </span>
          </div>
          <h3 className="text-lg font-bold leading-snug mb-2">
            <Link
              href={`/articulo/${article.slug}`}
              className="hover:text-brand-gray transition-colors"
            >
              {article.title}
            </Link>
          </h3>
          <p className="text-sm text-text-secondary line-clamp-2 mb-3">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            {article.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/tag/${tag}`}
                className="text-xs px-2 py-1 bg-surface rounded hover:bg-surface-2 transition-colors"
              >
                #{tag}
              </Link>
            ))}
            <div className="flex-1"></div>
            <div className="flex items-center gap-4 text-sm text-text-secondary">
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {article.likes || 0}
              </span>
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                {article.comments || 0}
              </span>
              <span className="text-xs font-mono">{article.readTime}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function CategoryFeed({
  articles,
  categoryName,
}: CategoryFeedProps) {
  if (articles.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-bg-primary rounded-lg p-8 border border-surface-2 text-center">
          <p className="text-text-secondary">
            No hay artículos en esta categoría todavía.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header de categoría */}
      <div className="bg-bg-primary rounded-lg p-4 border border-surface-2">
        <h1 className="text-xl font-bold">{categoryName}</h1>
        <p className="text-sm text-text-secondary mt-1">
          {articles.length} {articles.length === 1 ? "artículo" : "artículos"}
        </p>
      </div>

      {/* Artículos */}
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  );
}
