const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcapagina.page';

const siteMetadata = {
  title: 'Marcapágina — Revista de Literatura',
  description: 'Revista independiente de literatura. Publicamos narrativa inédita, noticias del sector editorial y recursos para lectores y escritores.',
  language: 'es-ES',
  siteLogo: `${siteUrl}/og-image.png`,
  twitter: 'https://x.com/marcapaginanet',
  instagram: 'https://www.instagram.com/marcapagina.page/',
  facebook: 'https://www.facebook.com/profile.php?id=61577303794980',
  youtube: 'https://www.youtube.com/@MarcaPagina_page',
  threads: 'https://www.threads.com/@marcapagina.page',
  bluesky: 'https://bsky.app/profile/marcapagina.bsky.social',
};

export default function OrganizationSchema() {
  const sameAs = [
    siteMetadata.twitter,
    siteMetadata.instagram,
    siteMetadata.facebook,
    siteMetadata.youtube,
    siteMetadata.threads,
    siteMetadata.bluesky,
  ].filter(Boolean);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': siteUrl,
        name: siteMetadata.title,
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: siteMetadata.siteLogo,
        },
        ...(sameAs.length > 0 && { sameAs }),
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}#website`,
        url: siteUrl,
        name: siteMetadata.title,
        publisher: { '@id': siteUrl },
        inLanguage: siteMetadata.language,
        description: siteMetadata.description,
        mainEntity: {
          '@type': 'WebPage',
          '@id': `${siteUrl}#webpage`,
          url: siteUrl,
          name: siteMetadata.title,
          about: {
            '@type': 'Thing',
            name: 'Literatura',
            description: 'Revista de literatura con relatos, reseñas y noticias del sector editorial',
          },
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
