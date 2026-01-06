import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdBanner from '@/components/ads/AdBanner';
import TravelGuideLayout from '@/components/travel/TravelGuideLayout';
import ArticleSchema from '@/components/seo/ArticleSchema';
import { getArticleBySlug, getRelatedArticles } from '@/lib/articles';
import { Article, isTravelGuide, TravelGuide } from '@/lib/types/article';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcapagina.net';

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Artículo no encontrado',
    };
  }

  const articleUrl = `${siteUrl}/articulo/${slug}`;

  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.tags,
    authors: [{ name: article.author.name }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      url: articleUrl,
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
      canonical: articleUrl,
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

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Check if this is a travel guide and render special layout
  if (isTravelGuide(article)) {
    return <TravelGuideLayout article={article as TravelGuide} />;
  }

  const relatedArticles = await getRelatedArticles(article, 4);

  return (
    <>
      <ArticleSchema article={article} type="article" />
      <main className="pt-14 min-h-screen pb-20 lg:pb-0">
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header del artículo */}
        <header className="mb-8">
          {article.featured && (
            <span className="inline-block px-3 py-1 bg-brand-yellow text-brand-black-static text-xs font-bold uppercase tracking-wider rounded mb-4">
              Destacado
            </span>
          )}
          <Link
            href={`/categoria/${article.categorySlug}`}
            className="inline-block px-3 py-1 bg-surface text-text-secondary text-xs font-medium rounded mb-4 ml-2 hover:bg-surface-2 transition-colors"
          >
            {article.category}
          </Link>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {article.title}
          </h1>

          {/* Author info */}
          <div className="flex items-center gap-4 pb-6 border-b border-surface-2">
            <div className={`w-12 h-12 ${article.author.avatar} rounded-full`}></div>
            <div className="flex-1">
              <div className="font-semibold">{article.author.name}</div>
              <div className="text-sm text-brand-gray">{article.author.handle}</div>
            </div>
            <div className="text-right text-sm text-brand-gray">
              <div>{formatDate(article.publishedAt)}</div>
              <div>{article.readTime} de lectura</div>
            </div>
          </div>
        </header>

        {/* Contenido del artículo */}
        <div
          className="article-content prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Ad en medio del artículo */}
        <div className="my-10">
          <AdBanner size="leaderboard" />
        </div>

        {/* Notas al pie (solo para el artículo original con notas) */}
        {article.slug === 'manual-de-usuario-para-comenzar-a-leer' && (
          <footer className="mt-12 pt-8 border-t border-surface-2">
            <h3 className="text-lg font-bold mb-4">Notas</h3>
            <div className="space-y-4 text-sm text-brand-gray">
              {[
                {
                  id: 'nota-1',
                  refId: 'ref-1',
                  text: 'Dícese de la figura geométrica tridimensional que corresponde al libro, aunque en ocasiones también se puede acercar al cubo, pero jamás a la pirámide. En adelante estos paralelepípedos se identificarán como libros.',
                },
                {
                  id: 'nota-2',
                  refId: 'ref-2',
                  text: 'Ver paso tres para la adecuada comprensión de este término.',
                },
                {
                  id: 'nota-3',
                  refId: 'ref-3',
                  text: 'Se debe hacer una clara diferenciación entre el baño -a secas- y el baño de oficina, pues se trata de dos experiencias completamente distintas.',
                },
                {
                  id: 'nota-4',
                  refId: 'ref-4',
                  text: 'En un próximo número abordaremos la terminología básica del lector, y exploraremos términos como bibliómano, bibliofilia, entre otros.',
                },
              ].map((note) => (
                <p key={note.id} id={note.id}>
                  <strong>[{note.id.replace('nota-', '')}]</strong> {note.text}{' '}
                  <a
                    href={`#${note.refId}`}
                    className="badge bg-brand-black-static text-brand-yellow border-none text-xs hover:bg-brand-gray"
                  >
                    Volver
                  </a>
                </p>
              ))}
            </div>
          </footer>
        )}

        {/* Tags */}
        <div className="mt-8 pt-6 border-t border-surface-2">
          <div className="flex items-center gap-2 flex-wrap">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${tag}`}
                className="px-3 py-1 bg-surface text-sm rounded-full hover:bg-surface-2 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Acciones del artículo */}
        <div className="mt-8 flex items-center justify-between py-4 border-t border-b border-surface-2">
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
            <button className="flex items-center gap-2 text-brand-gray hover:text-text-primary transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="font-medium">{article.comments || 0}</span>
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
            <button
              className="p-2 text-brand-gray hover:text-text-primary transition-colors"
              title="Compartir"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Autor bio */}
        <div className="mt-8 p-6 bg-bg-primary rounded-lg border border-surface-2">
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 ${article.author.avatar} rounded-full flex-shrink-0`}></div>
            <div>
              <h3 className="font-bold text-lg">{article.author.name}</h3>
              <p className="text-sm text-brand-gray mb-3">{article.author.handle}</p>
              <p className="text-sm text-brand-gray">{article.author.bio}</p>
              <button className="mt-4 btn btn-sm bg-brand-black-static text-brand-white-static hover:bg-brand-gray">
                Seguir
              </button>
            </div>
          </div>
        </div>

        {/* Ad final */}
        <div className="mt-8">
          <AdBanner size="leaderboard" className="md:min-h-[250px]" />
        </div>

        {/* Artículos relacionados */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-6">Más artículos</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {relatedArticles.length > 0
              ? relatedArticles.map((item) => (
                <Link
                  key={item.slug}
                  href={`/articulo/${item.slug}`}
                  className="p-4 bg-bg-primary rounded-lg border border-surface-2 hover:border-brand-gray/30 transition-colors group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-6 h-6 ${item.author.avatar} rounded-full`}></div>
                    <span className="text-sm text-brand-gray">{item.author.name}</span>
                  </div>
                  <h3 className="font-semibold group-hover:text-brand-gray transition-colors">
                    {item.title}
                  </h3>
                </Link>
              ))
              : // Fallback si no hay artículos relacionados
              [
                {
                  title: 'Los pájaros que vimos aquel verano',
                  author: 'Lucía Mbomío',
                  color: 'bg-purple-200',
                },
                {
                  title: 'Instrucciones para desaparecer',
                  author: 'Daniel Monedero',
                  color: 'bg-green-200',
                },
                {
                  title: 'El último café del mundo',
                  author: 'Carmen Laforet Jr.',
                  color: 'bg-orange-200',
                },
                {
                  title: 'Cartografía de lo invisible',
                  author: 'Andrés Neuman',
                  color: 'bg-blue-200',
                },
              ].map((item, index) => (
                <Link
                  key={index}
                  href="#"
                  className="p-4 bg-bg-primary rounded-lg border border-surface-2 hover:border-brand-gray/30 transition-colors group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-6 h-6 ${item.color} rounded-full`}></div>
                    <span className="text-sm text-brand-gray">{item.author}</span>
                  </div>
                  <h3 className="font-semibold group-hover:text-brand-gray transition-colors">
                    {item.title}
                  </h3>
                </Link>
              ))}
          </div>
        </section>
      </article>
    </main>
    </>
  );
}
