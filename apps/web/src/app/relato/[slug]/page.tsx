import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import ArticleSchema from '@/components/seo/ArticleSchema';
import { getArticleBySlug, getAllArticles, getAllTranstextosSlugs } from '@/lib/articles';
import { isTravelGuide, isRecipe } from '@/lib/types/article';
import RelatoHeader from '@/components/layout/RelatoHeader';
import { Avatar, ShareButton } from '@/components';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.marcapagina.page';

// Generate static paths at build time (local articles + Sanity transtextos)
export async function generateStaticParams() {
  const [articles, transtextosSlugs] = await Promise.all([
    getAllArticles(),
    getAllTranstextosSlugs(),
  ]);

  const localSlugs = articles.map((article) => ({ slug: article.slug }));
  const sanitySlugs = transtextosSlugs.map((slug) => ({ slug }));

  // Combine both, removing duplicates
  const allSlugs = new Map<string, { slug: string }>();
  [...localSlugs, ...sanitySlugs].forEach((item) => {
    allSlugs.set(item.slug, item);
  });

  return Array.from(allSlugs.values());
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

  // Si es contenido de "A pie de página" (guías de viaje, recetas), redirigir a /articulo/
  // La ruta /relato/ es exclusiva para narrativa
  if (isTravelGuide(article) || isRecipe(article)) {
    redirect(`/articulo/${slug}`);
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
            <Avatar name={article.author.name} size="md" />
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

        {/* Botones de interacción */}
        <div className="flex items-center justify-between py-4 border-t border-b border-surface-2">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-brand-gray hover:text-red-500 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="font-medium">{article.likes || 0}</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="p-2 text-brand-gray hover:text-text-primary transition-colors"
              title="Guardar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>
            <ShareButton
              title={article.title}
              url={`${siteUrl}/relato/${article.slug}`}
            />
          </div>
        </div>

        {/* Tags y navegación mínima */}
        {(article.tags.length > 0 || article.category) && (
          <div className="flex items-center flex-wrap gap-2 pt-6">
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
            <Avatar name={article.author.name} size="xl" />
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
