const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcapagina.net';

const navigationItems = [
  { name: 'Inicio', url: `${siteUrl}/` },
  { name: 'Transtextos', url: `${siteUrl}/transtextos` },
  { name: 'Autores', url: `${siteUrl}/transtextos/autores` },
  { name: 'Horóscopo', url: `${siteUrl}/horoscopo` },
];

export default function NavigationSchema() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    '@id': `${siteUrl}#navigation`,
    name: 'Navegación Principal',
    url: siteUrl,
    hasPart: navigationItems.map((item, index) => ({
      '@type': 'WebPage',
      '@id': `${item.url}#webpage`,
      name: item.name,
      url: item.url,
      position: index + 1,
      isPartOf: {
        '@id': `${siteUrl}#website`,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
