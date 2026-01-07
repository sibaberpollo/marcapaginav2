import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllArticles } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'Artículos | Marcapágina',
  description: 'Artículos, ensayos y reflexiones sobre literatura, lectura y cultura.',
};

function formatDateParts(isoDate: string) {
  const date = new Date(isoDate);
  return {
    day: date.getDate().toString().padStart(2, '0'),
    month: date.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '').toUpperCase(),
  };
}

export default async function ArticulosPage() {
  const articles = await getAllArticles();

  return (
    <main className="min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <header className="bg-bg-primary border border-surface-2 rounded-lg p-6 shadow-sm">
          <span className="badge bg-brand-yellow text-brand-black-static border-none text-xs font-bold mb-3">
            Revista
          </span>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">Artículos</h1>
          <p className="text-text-secondary leading-relaxed">
            Ensayos, reflexiones y guías literarias. Exploramos la lectura, la escritura y la cultura
            desde múltiples perspectivas.
          </p>
        </header>

        <section className="space-y-4">
          {articles.length === 0 ? (
            <div className="bg-bg-primary border border-surface-2 rounded-lg p-6 text-text-secondary">
              Aún no hay artículos publicados.
            </div>
          ) : (
            articles.map((article) => {
              const { day, month } = formatDateParts(article.publishedAt);
              return (
                <article
                  key={article.slug}
                  className="bg-bg-primary rounded-lg border border-surface-2 hover:border-brand-gray/30 transition-colors p-4"
                >
                  <div className="grid grid-cols-[80px_1fr] gap-4 items-start">
                    <div className="text-center pt-1">
                      <div className="text-3xl font-extrabold text-brand-black-static leading-none">{day}</div>
                      <div className="uppercase tracking-[0.2em] text-xs text-brand-gray">{month}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="badge badge-sm bg-surface text-text-secondary border-none">
                          {article.category}
                        </span>
                        <span className="text-xs text-text-secondary">{article.readTime}</span>
                      </div>
                      <h2 className="text-xl font-bold leading-snug">
                        <Link
                          href={`/articulo/${article.slug}`}
                          className="hover:text-brand-yellow transition-colors"
                        >
                          {article.title}
                        </Link>
                      </h2>
                      <p className="text-sm text-text-secondary mt-1">
                        Por: <span className="font-medium">{article.author.name}</span>
                      </p>
                      <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-text-secondary bg-surface px-2 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>

        {/* Paginación placeholder para cuando haya más artículos */}
        <div className="flex items-center justify-between pt-4 border-t border-surface-2">
          <div className="text-sm text-text-secondary">
            {articles.length} artículos
          </div>
          <div className="flex items-center gap-2">
            <span className="btn btn-ghost btn-sm btn-disabled">Anterior</span>
            <span className="btn btn-ghost btn-sm btn-disabled">Siguiente</span>
          </div>
        </div>
      </div>
    </main>
  );
}
