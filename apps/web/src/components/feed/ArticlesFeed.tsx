import Link from 'next/link';
import { Fragment } from 'react';
import type { ArticleSummary } from '@/lib/types/article';
import MemeCard from './MemeCard';
import HorizontalAdBanner from '../ads/HorizontalAdBanner';

interface ArticlesFeedProps {
  articles: ArticleSummary[];
}

function formatDateParts(isoDate: string) {
  const date = new Date(isoDate);
  return {
    day: date.getDate().toString().padStart(2, '0'),
    month: date.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '').toUpperCase(),
  };
}

export default function ArticlesFeed({ articles }: ArticlesFeedProps) {
  if (articles.length === 0) {
    return (
      <div className="bg-bg-primary border border-surface-2 rounded-lg p-6 text-text-secondary">
        Aún no hay artículos publicados.
      </div>
    );
  }

  const insertIndex = Math.max(1, Math.floor(articles.length / 2));

  return (
    <div className="space-y-4">
      {articles.map((article, index) => {
        const { day, month } = formatDateParts(article.publishedAt);

        return (
          <Fragment key={article.slug}>
            {index === insertIndex && (
              <>
                <HorizontalAdBanner className="my-4" />
                <MemeCard
                  title="Los chapulines salvajes"
                  imageUrl="https://res.cloudinary.com/dx98vnos1/image/upload/v1750790673/post-chapulines-salvajes_wipmms.png"
                  alt="Los chapulines salvajes - Parodia de Los detectives salvajes"
                  slug="los-chapulines-salvajes"
                />
              </>
            )}
            <article
              className="bg-bg-primary rounded-lg border border-surface-2 hover:border-brand-gray/30 transition-colors p-4"
            >
              <div className="grid grid-cols-[72px_1fr] gap-4 items-start">
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-brand-black-static leading-none">{day}</div>
                  <div className="uppercase tracking-[0.2em] text-[11px] text-brand-gray">{month}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-text-secondary flex-wrap">
                    <span className="badge badge-xs bg-surface text-text-secondary border-none">
                      {article.category}
                    </span>
                    <span>{article.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold leading-snug">
                    <Link href={`/articulo/${article.slug}`} className="hover:text-brand-gray transition-colors">
                      {article.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-text-secondary">
                    Por: <span className="font-medium">{article.author.name}</span>
                  </p>
                  <p className="text-sm text-text-secondary line-clamp-2 md:line-clamp-3">{article.excerpt}</p>
                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-text-secondary bg-surface px-2 py-0.5 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          </Fragment>
        );
      })}

      {/* Fallback: si la lista es muy corta, aseguramos mostrar el meme al final */}
      {articles.length > 0 && articles.length <= 2 && (
        <MemeCard
          title="Los chapulines salvajes"
          imageUrl="https://res.cloudinary.com/dx98vnos1/image/upload/v1750790673/post-chapulines-salvajes_wipmms.png"
          alt="Los chapulines salvajes - Parodia de Los detectives salvajes"
          slug="los-chapulines-salvajes"
        />
      )}
    </div>
  );
}
