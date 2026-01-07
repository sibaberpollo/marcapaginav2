import { Article } from '@/lib/types/article';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcapagina.page';

interface ArticleSchemaProps {
  article: Article;
  type?: 'article' | 'relato';
}

export default function ArticleSchema({ article, type = 'article' }: ArticleSchemaProps) {
  const articleUrl = `${siteUrl}/${type === 'relato' ? 'relato' : 'articulo'}/${article.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${articleUrl}#article`,
    headline: article.title,
    description: article.excerpt,
    url: articleUrl,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Marcapágina',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/og-image.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    articleSection: article.category,
    keywords: article.tags.join(', '),
    inLanguage: 'es-ES',
    isPartOf: {
      '@id': `${siteUrl}#website`,
    },
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
