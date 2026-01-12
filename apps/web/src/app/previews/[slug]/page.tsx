import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Header, LeftSidebar } from '@/components';
import PreviewHero from '@/components/preview/PreviewHero';
import ChapterReader from '@/components/preview/ChapterReader';
import AuthorCard from '@/components/preview/AuthorCard';
import { getPreviewBySlug, getAllPreviewSlugs } from '@/lib/previews';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.marcapagina.page';

// Generate static paths at build time
export async function generateStaticParams() {
  const slugs = await getAllPreviewSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = true;

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const preview = await getPreviewBySlug(slug);

  if (!preview) {
    return {
      title: 'Preview no encontrado',
    };
  }

  const previewUrl = `${siteUrl}/previews/${slug}`;
  const plainSynopsis = preview.synopsis.replace(/<[^>]*>/g, '').substring(0, 160);

  return {
    title: `${preview.title} - Preview | MarcaPágina`,
    description: plainSynopsis,
    keywords: [...preview.genre, preview.author.name, 'novela', 'preview', 'lectura'],
    authors: [{ name: preview.author.name }],
    openGraph: {
      title: `${preview.title} - Preview de novela`,
      description: plainSynopsis,
      type: 'book',
      url: previewUrl,
      authors: [preview.author.name],
      tags: preview.genre,
      locale: 'es_ES',
      images: preview.coverImage ? [{ url: preview.coverImage, alt: preview.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${preview.title} - Preview`,
      description: plainSynopsis,
      images: preview.coverImage ? [preview.coverImage] : [],
    },
    alternates: {
      canonical: previewUrl,
    },
  };
}

export default async function PreviewPage({ params }: PageProps) {
  const { slug } = await params;
  const preview = await getPreviewBySlug(slug);

  if (!preview) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pb-20 lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-[240px_1fr] gap-6">
            <LeftSidebar />

            <div className="max-w-4xl w-full">
              <PreviewHero preview={preview} />

              <ChapterReader
                chapters={preview.chapters}
                purchaseUrl={preview.purchaseUrl}
                purchaseLabel={preview.purchaseLabel}
              />

              <AuthorCard author={preview.author} />

              {/* Final CTA */}
              <section className="px-4 py-8 text-center">
                <div className="p-8 bg-gradient-to-r from-amber-950/20 via-surface to-blue-950/20 border border-surface-2 rounded-xl">
                  <h2 className="text-2xl font-bold text-text-primary mb-4">
                    ¿Te atrapó la historia?
                  </h2>
                  <p className="text-text-secondary mb-6 max-w-xl mx-auto">
                    Este es solo el comienzo. Descubre cómo se desarrolla la trama,
                    quién es realmente la asesina, y qué secretos guarda el Estado.
                  </p>
                  <a
                    href={preview.purchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-brand-yellow text-brand-black-static font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {preview.purchaseLabel || 'Comprar novela completa'}
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
