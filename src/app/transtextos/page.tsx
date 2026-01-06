import Link from 'next/link';
import { fetchSanity } from '@/lib/sanity';
import RelatoHeader from '@/components/layout/RelatoHeader';

const PAGE_SIZE = 10;

type Transtexto = {
  id: string;
  slug?: string;
  title?: string;
  summary?: string;
  publishedAt?: string;
  author?: string;
};

async function getTranstextos(page: number) {
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const query = `{
    "items": *[_type == "relato" && status == "published" && site->slug.current == "transtextos"] | order(coalesce(date + "T00:00:00Z", publishedAt) desc)[${start}...${end}]{
      "id": _id,
      "slug": slug.current,
      title,
      "summary": summary,
      "publishedAt": coalesce(date, publishedAt),
      "author": author->name
    },
    "total": count(*[_type == "relato" && status == "published" && site->slug.current == "transtextos"])
  }`;

  return fetchSanity<{ items: Transtexto[]; total: number }>(query);
}

function formatDateParts(isoDate?: string) {
  if (!isoDate) return { day: '--', month: '--' };
  const date = new Date(isoDate);
  return {
    day: date.getDate().toString().padStart(2, '0'),
    month: date.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '').toUpperCase(),
  };
}

export default async function TranstextosPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(Array.isArray(params?.page) ? params?.page[0] : params?.page || '1'));

  const { items, total } = await getTranstextos(currentPage);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < pageCount;

  return (
    <>
      <RelatoHeader />
      <main className="min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <header className="bg-bg-primary border border-surface-2 rounded-lg p-6 shadow-sm">
          <span className="badge bg-brand-yellow text-brand-black-static border-none text-xs font-bold mb-3">
            Feed de narrativa
          </span>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">Transtextos</h1>
          <p className="text-text-secondary leading-relaxed">
            Feed de narrativa, fundado por Javier Miranda-Luque (1959 - 2023) y editado actualmente a seis
            manos (desde Buenos Aires, Barcelona y Caracas), por los caraqueños diasporizados Luis Garmendia
            y Quim Ramos, y el caraqueño sin diasporizar (¿por ahora?) Mirco Ferri, cuya idea es la de
            postear textos propios y de autores invitados. ¡Bienvenido cada par de ojos lectores que se
            asomen a estos predios!
          </p>
        </header>

        <section className="space-y-4">
          {items.length === 0 ? (
            <div className="bg-bg-primary border border-surface-2 rounded-lg p-6 text-text-secondary">
              Aún no hay relatos publicados.
            </div>
          ) : (
            items.map((item) => {
              const { day, month } = formatDateParts(item.publishedAt);
              return (
                <article
                  key={item.id}
                  className="bg-bg-primary rounded-lg border border-surface-2 hover:border-brand-gray/30 transition-colors p-4"
                >
                  <div className="grid grid-cols-[80px_1fr] gap-4 items-center">
                    <div className="text-center">
                      <div className="text-3xl font-extrabold text-brand-black-static leading-none">{day}</div>
                      <div className="uppercase tracking-[0.2em] text-xs text-brand-gray">{month}</div>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold leading-snug">
                        {item.slug ? (
                          <Link
                            href={`/relato/${item.slug}`}
                            className="hover:text-brand-yellow transition-colors"
                          >
                            {item.title}
                          </Link>
                        ) : (
                          item.title
                        )}
                      </h2>
                      {item.author && (
                        <p className="text-sm text-text-secondary mt-1">
                          Por: <span className="font-medium">{item.author}</span>
                        </p>
                      )}
                      {item.summary && (
                        <p className="text-sm text-text-secondary mt-2 line-clamp-2 md:line-clamp-3">
                          {item.summary}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>

        <div className="flex items-center justify-between pt-4 border-t border-surface-2">
          <div className="text-sm text-text-secondary">
            Página {currentPage} de {pageCount} · {total} relatos
          </div>
          <div className="flex items-center gap-2">
            {hasPrev ? (
              <Link href={`/transtextos?page=${currentPage - 1}`} className="btn btn-ghost btn-sm">
                ← Anterior
              </Link>
            ) : (
              <span className="btn btn-ghost btn-sm btn-disabled">← Anterior</span>
            )}
            {hasNext ? (
              <Link href={`/transtextos?page=${currentPage + 1}`} className="btn btn-ghost btn-sm">
                Siguiente →
              </Link>
            ) : (
              <span className="btn btn-ghost btn-sm btn-disabled">Siguiente →</span>
            )}
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
