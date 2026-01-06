import Link from 'next/link';
import { notFound } from 'next/navigation';
import TravelGuideLayout from '@/components/travel/TravelGuideLayout';
import ArticleSchema from '@/components/seo/ArticleSchema';
import { getArticleBySlug, getAllArticles } from '@/lib/articles';
import { isTravelGuide, TravelGuide } from '@/lib/types/article';
import RelatoHeader from '@/components/layout/RelatoHeader';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcapagina.net';

// Generate static paths at build time
export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// Allow dynamic params for Sanity articles not in local files
export const dynamicParams = true;

// Generate metadata for SEO - specific to /relato/ URL
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Relato no encontrado',
    };
  }

  const relatoUrl = `${siteUrl}/relato/${slug}`;

  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.tags,
    authors: [{ name: article.author.name }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      url: relatoUrl,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      authors: [article.author.name],
      tags: article.tags,
      section: article.category,
      locale: 'es_ES',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
    },
    alternates: {
      canonical: relatoUrl,
    },
  };
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
    <>
      <ArticleSchema article={article} type="relato" />
      <RelatoHeader />
      <main className="pb-24">
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

        {/* In-content Ad */}
        <div className="my-8 py-6 border-y border-surface-2">
          <div className="bg-surface border border-dashed border-brand-gray/30 rounded-lg w-full max-w-[336px] mx-auto h-[280px] flex items-center justify-center">
            <span className="text-xs text-brand-gray uppercase tracking-wider">
              Publicidad · 336x280
            </span>
          </div>
        </div>

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
    </>
  );
}
