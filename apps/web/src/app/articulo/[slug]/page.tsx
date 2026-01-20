import Link from 'next/link';
import { notFound } from 'next/navigation';
import TravelGuideLayout from '@/components/travel/TravelGuideLayout';
import RecipeLayout from '@/components/recipe/RecipeLayout';
import ArticleSchema from '@/components/seo/ArticleSchema';
import { getArticleBySlug, getRelatedArticles, getAllArticles } from '@/lib/articles';
import { isTravelGuide, TravelGuide, isRecipe, Recipe } from '@/lib/types/article';
import { ArticlePageLayout, Avatar, ShareButton } from '@/components';
import BoxAdBanner from '@/components/ads/BoxAdBanner';
import { getAuthorByName } from '@/lib/sanity';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.marcapagina.page';

// Generate static paths at build time
export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// Allow dynamic params for Sanity articles not in local files
export const dynamicParams = true;

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Artículo no encontrado',
    };
  }

  const articleUrl = `${siteUrl}/articulo/${slug}/`;

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

  // Enriquecer datos del autor si existe en Sanity
  const sanityAuthor = await getAuthorByName(article.author.name);
  const enrichedAuthor = {
    ...article.author,
    bio: sanityAuthor?.bio || article.author.bio,
    slug: sanityAuthor?.slug,
  };

  // Check if this is a recipe and render special layout
  if (isRecipe(article)) {
    const enrichedArticle = {
      ...article,
      author: enrichedAuthor,
    } as Recipe;
    return <RecipeLayout article={enrichedArticle} />;
  }

  const author = enrichedAuthor;

  const relatedArticles = await getRelatedArticles(article, 4);

  return (
    <>
      <ArticleSchema article={article} type="article" />
      <ArticlePageLayout>
        <article className="px-1 py-2 space-y-8">
          <header className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              {article.featured && (
                <span className="inline-block px-3 py-1 bg-brand-yellow text-brand-black-static text-xs font-bold uppercase tracking-wider rounded">
                  Destacado
                </span>
              )}
              <Link
                href={`/categoria/${article.categorySlug}`}
                className="inline-block px-3 py-1 bg-surface text-text-secondary text-xs font-medium rounded hover:bg-surface-2 transition-colors"
              >
                {article.category}
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 pb-6 border-b border-surface-2">
              <Avatar name={article.author.name} size="lg" />
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

          <div
            className="article-content prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* In-content Ad */}
          <div className="my-8 py-6 border-y border-surface-2">
            <BoxAdBanner />
          </div>

          {article.slug === 'manual-de-usuario-para-comenzar-a-leer' && (
            <footer className="pt-8 border-t border-surface-2">
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

          <div className="pt-6 border-t border-surface-2">
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
              <ShareButton
                title={article.title}
                url={`${siteUrl}/articulo/${article.slug}/`}
              />
            </div>
          </div>

          <div className="p-6 bg-bg-primary rounded-lg border border-surface-2">
            <div className="flex items-start gap-4">
              <Avatar name={author.name} size="xl" />
              <div>
                <h3 className="font-bold text-lg">
                  {author.slug ? (
                    <Link href={`/autor/${author.slug}`} className="hover:underline">
                      {author.name}
                    </Link>
                  ) : (
                    author.name
                  )}
                </h3>
                <p className="text-sm text-brand-gray mb-3">{author.handle}</p>
                <p className="text-sm text-brand-gray">{author.bio}</p>
              </div>
            </div>
          </div>

          <section className="space-y-4">
            <h2 className="text-xl font-bold">Más artículos</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedArticles.length > 0
                ? relatedArticles.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/articulo/${item.slug}`}
                    className="p-4 bg-bg-primary rounded-lg border border-surface-2 hover:border-brand-gray/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar name={item.author.name} size="xs" />
                      <span className="text-sm text-brand-gray">{item.author.name}</span>
                    </div>
                    <h3 className="font-semibold group-hover:text-brand-gray transition-colors">
                      {item.title}
                    </h3>
                  </Link>
                ))
                : [
                  {
                    title: 'Los pájaros que vimos aquel verano',
                    author: 'Lucía Mbomío',
                  },
                  {
                    title: 'Instrucciones para desaparecer',
                    author: 'Daniel Monedero',
                  },
                  {
                    title: 'El último café del mundo',
                    author: 'Carmen Laforet Jr.',
                  },
                  {
                    title: 'Cartografía de lo invisible',
                    author: 'Andrés Neuman',
                  },
                ].map((item, index) => (
                  <Link
                    key={index}
                    href="#"
                    className="p-4 bg-bg-primary rounded-lg border border-surface-2 hover:border-brand-gray/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar name={item.author} size="xs" />
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
      </ArticlePageLayout>
    </>
  );
}
