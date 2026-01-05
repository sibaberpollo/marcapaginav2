export { generateMetadata } from '@/app/articulo/[slug]/page';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import TravelGuideLayout from '@/components/travel/TravelGuideLayout';
import { getArticleBySlug } from '@/lib/articles';
import { isTravelGuide, TravelGuide } from '@/lib/types/article';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function RelatoPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Si llega una guía, reusa el layout de viaje.
  if (isTravelGuide(article)) {
    return <TravelGuideLayout article={article as TravelGuide} />;
  }

  return (
    <main className="pt-16 pb-24">
      <article className="max-w-3xl mx-auto px-4 space-y-10">
        {/* Encabezado compacto para lectura */}
        <header className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <span className="px-3 py-1 bg-surface rounded-full font-semibold text-xs tracking-wide uppercase">
              Relato
            </span>
            <span>{formatDate(article.publishedAt)}</span>
            {article.readTime && <span>· {article.readTime}</span>}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight text-text-primary">
            {article.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <div className={`w-10 h-10 ${article.author.avatar} rounded-full flex-shrink-0`}></div>
            <div>
              <div className="font-semibold text-text-primary">{article.author.name}</div>
              {article.author.handle && <div>{article.author.handle}</div>}
            </div>
          </div>
        </header>

        {/* Contenido enfocado a lectura */}
        <div
          className="article-content prose prose-lg md:prose-xl max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags y navegación mínima */}
        {(article.tags.length > 0 || article.category) && (
          <div className="flex items-center flex-wrap gap-2 pt-6 border-t border-surface-2">
            {article.category && (
              <Link
                href={`/categoria/${article.categorySlug}`}
                className="px-3 py-1 bg-surface rounded-full text-sm text-text-secondary hover:bg-surface-2 transition-colors"
              >
                {article.category}
              </Link>
            )}
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${tag}`}
                className="px-3 py-1 bg-surface rounded-full text-sm text-text-secondary hover:bg-surface-2 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Bio breve */}
        <div className="rounded-xl border border-surface-2 bg-bg-primary p-5">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 ${article.author.avatar} rounded-full flex-shrink-0`}></div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{article.author.name}</h3>
              {article.author.handle && (
                <p className="text-sm text-text-secondary">{article.author.handle}</p>
              )}
              {article.author.bio && <p className="text-sm text-text-secondary">{article.author.bio}</p>}
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
