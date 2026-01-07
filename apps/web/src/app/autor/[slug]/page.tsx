import Link from 'next/link';
import { notFound } from 'next/navigation';
import RelatoHeader from '@/components/layout/RelatoHeader';
import { fetchSanity } from '@/lib/sanity';

type Relato = {
  slug?: string;
  title?: string;
  summary?: string;
  date?: string;
};

type Autor = {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  pais?: string;
  instagram?: string;
  twitter?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  relatos: Relato[];
};

async function getAutor(slug: string): Promise<Autor | null> {
  const query = `{
    "author": *[_type == "autor" && slug.current == $slug][0]{
      "id": _id,
      name,
      bio,
      avatar,
      pais,
      instagram,
      twitter,
      website,
      linkedin,
      github,
      "relatos": *[_type == "relato" && references(^._id)] | order(coalesce(publishedAt, date, _createdAt) desc){
        "slug": slug.current,
        title,
        summary,
        date
      }
    }
  }`;

  try {
    const { author } = await fetchSanity<{ author: Autor | null }>(query, { slug });
    return author || null;
  } catch (error) {
    console.error(`Error fetching author ${slug}:`, error);
    return null;
  }
}

function Avatar({ name, avatar }: { name: string; avatar?: string }) {
  const initial = name?.[0]?.toUpperCase() || 'A';

  return (
    <div className="w-16 h-16 rounded-full bg-brand-yellow text-brand-black-static font-bold flex items-center justify-center overflow-hidden ring-2 ring-surface-2 flex-shrink-0">
      {avatar ? (
        <div
          className="w-full h-full bg-center bg-cover rounded-full"
          style={{ backgroundImage: `url(${avatar})` }}
          aria-hidden
        />
      ) : (
        <span className="text-xl">{initial}</span>
      )}
    </div>
  );
}

function formatDate(iso?: string) {
  if (!iso) return null;
  const date = new Date(iso);
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function AutorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const autor = await getAutor(slug);

  if (!autor) {
    notFound();
  }

  return (
    <>
      <RelatoHeader />
      <main className="pb-24">
        <div className="max-w-4xl mx-auto px-4 space-y-10">
          <header className="flex gap-4 items-start">
            <Avatar name={autor.name} avatar={autor.avatar} />
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">{autor.name}</h1>
              {autor.pais && (
                <p className="text-sm text-text-secondary uppercase tracking-wide">{autor.pais}</p>
              )}
              {autor.bio && <p className="text-text-secondary leading-relaxed">{autor.bio}</p>}
              <div className="flex items-center gap-3 text-sm text-text-secondary flex-wrap">
                {autor.website && (
                  <Link href={autor.website} target="_blank" className="hover:text-text-primary">
                    Sitio
                  </Link>
                )}
                {autor.instagram && (
                  <Link href={autor.instagram} target="_blank" className="hover:text-text-primary">
                    Instagram
                  </Link>
                )}
                {autor.twitter && (
                  <Link href={autor.twitter} target="_blank" className="hover:text-text-primary">
                    X
                  </Link>
                )}
                {autor.linkedin && (
                  <Link href={autor.linkedin} target="_blank" className="hover:text-text-primary">
                    LinkedIn
                  </Link>
                )}
                {autor.github && (
                  <Link href={autor.github} target="_blank" className="hover:text-text-primary">
                    GitHub
                  </Link>
                )}
              </div>
            </div>
          </header>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Relatos</h2>
              <span className="text-sm text-text-secondary">
                {autor.relatos.length} {autor.relatos.length === 1 ? 'relato' : 'relatos'}
              </span>
            </div>
            {autor.relatos.length === 0 ? (
              <div className="bg-bg-primary border border-surface-2 rounded-lg p-4 text-text-secondary">
                No hay relatos publicados.
              </div>
            ) : (
              <div className="space-y-3">
                {autor.relatos.map((relato) => (
                  <article
                    key={relato.slug || relato.title}
                    className="bg-bg-primary border border-surface-2 rounded-lg p-4 hover:border-brand-gray/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 text-xs text-text-secondary mb-1">
                      {relato.date && <span>{formatDate(relato.date)}</span>}
                    </div>
                    <h3 className="text-lg font-semibold leading-snug">
                      {relato.slug ? (
                        <Link
                          href={`/relato/${relato.slug}`}
                          className="hover:text-brand-gray transition-colors"
                        >
                          {relato.title}
                        </Link>
                      ) : (
                        relato.title
                      )}
                    </h3>
                    {relato.summary && (
                      <p className="text-sm text-text-secondary mt-1 line-clamp-2">{relato.summary}</p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
