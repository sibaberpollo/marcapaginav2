import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticlesFeed, FeaturedPreviewPost, LeftSidebar, RightSidebar } from '@/components';
import { getAllArticles } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'Artículos | Marcapágina',
  description: 'Artículos, ensayos y reflexiones sobre literatura, lectura y cultura.',
};

export default async function ArticulosPage() {
  const articles = await getAllArticles();

  return (
    <main className="min-h-screen pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[240px_1fr_320px] gap-6">
          <LeftSidebar />

          <div className="space-y-4">
            <header className="bg-bg-primary border border-surface-2 rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <span className="badge bg-brand-yellow text-brand-black-static border-none text-xs font-bold mb-2">
                    Revista
                  </span>
                  <h1 className="text-2xl md:text-3xl font-bold leading-tight">Artículos</h1>
                  <p className="text-text-secondary text-sm md:text-base mt-1">
                    Ensayos, reflexiones y guías literarias seleccionadas por la redacción.
                  </p>
                </div>
                <Link href="/" className="text-sm font-semibold text-text-secondary hover:text-brand-gray transition-colors">
                  ← Volver al inicio
                </Link>
              </div>
            </header>

            <ArticlesFeed articles={articles} />

            {/* Featured Preview CTA */}
            <FeaturedPreviewPost
              title="Alta Pureza"
              author="Marianne Díaz Hernández"
              genre="Thriller"
              excerpt="Una novela que comienza con el hallazgo de un cadáver en una hacienda del páramo andino y sigue la investigación de Ana, una abogada venezolana que enfrenta más de un misterio."
              coverImage="https://public-files.gumroad.com/xgdjeqtl5792s8io16abkoshyx1u"
              slug="alta-pureza"
              chaptersCount={3}
            />

            <div className="flex items-center justify-between pt-4 border-t border-surface-2">
              <div className="text-sm text-text-secondary">{articles.length} artículos</div>
              <div className="flex items-center gap-2">
                <span className="btn btn-ghost btn-sm btn-disabled">Anterior</span>
                <span className="btn btn-ghost btn-sm btn-disabled">Siguiente</span>
              </div>
            </div>
          </div>

          <RightSidebar />
        </div>
      </div>
    </main>
  );
}
