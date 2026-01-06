import Link from 'next/link';
import RelatoHeader from '@/components/layout/RelatoHeader';
import { fetchSanity } from '@/lib/sanity';

type Autor = {
  id: string;
  name: string;
  slug?: string;
  bio?: string;
  avatar?: string;
  pais?: string;
  instagram?: string;
  twitter?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  relatoCount: number;
};

async function getAutores() {
  const query = `{
    "authors": *[_type == "autor" && count(*[_type == "relato" && references(^._id)]) > 0]{
      "id": _id,
      name,
      "slug": slug.current,
      bio,
      avatar,
      pais,
      instagram,
      twitter,
      website,
      linkedin,
      github,
      "relatoCount": count(*[_type == "relato" && references(^._id)])
    } | order(relatoCount desc, name asc)
  }`;

  const { authors } = await fetchSanity<{ authors: Autor[] }>(query);
  return authors;
}

function Avatar({ name, avatar }: { name: string; avatar?: string }) {
  const initial = name?.[0]?.toUpperCase() || 'A';

  return (
    <div className="w-12 h-12 rounded-full bg-brand-yellow text-brand-black-static font-bold flex items-center justify-center overflow-hidden ring-2 ring-surface-2">
      {avatar ? (
        // Usamos background-image para evitar configurar dominios remotos
        <div
          className="w-full h-full bg-center bg-cover"
          style={{ backgroundImage: `url(${avatar})` }}
          aria-hidden
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}

export default async function AutoresPage() {
  const autores = await getAutores();

  return (
    <>
      <RelatoHeader />
      <main className="pb-24">
        <div className="max-w-5xl mx-auto px-4 space-y-8">
          <header className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-text-secondary">
              Transtextos
            </p>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">Autores</h1>
            <p className="text-text-secondary">
              Todos los autores con relatos publicados en Transtextos.
            </p>
          </header>

          {autores.length === 0 ? (
            <div className="bg-bg-primary border border-surface-2 rounded-lg p-6 text-text-secondary">
              Aún no hay autores con relatos publicados.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {autores.map((autor) => (
                <article
                  key={autor.id}
                  className="bg-bg-primary border border-surface-2 rounded-lg p-4 flex gap-3 hover:border-brand-gray/30 transition-colors"
                >
                  <Avatar name={autor.name} avatar={autor.avatar} />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="font-semibold text-lg">
                          {autor.slug ? (
                            <Link
                              href={`/autor/${autor.slug}`}
                              className="hover:text-brand-yellow transition-colors"
                            >
                              {autor.name}
                            </Link>
                          ) : (
                            autor.name
                          )}
                        </h2>
                        <p className="text-xs text-text-secondary uppercase tracking-wide">
                          {autor.relatoCount} {autor.relatoCount === 1 ? 'relato' : 'relatos'}
                        </p>
                      </div>
                      {autor.pais && (
                        <span className="text-xs px-2 py-1 bg-surface rounded-full text-text-secondary">
                          {autor.pais}
                        </span>
                      )}
                    </div>
                    {autor.bio && (
                      <p className="text-sm text-text-secondary line-clamp-3">{autor.bio}</p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-text-secondary flex-wrap">
                      {autor.website && (
                        <Link href={autor.website} className="hover:text-text-primary" target="_blank">
                          Sitio
                        </Link>
                      )}
                      {autor.instagram && (
                        <Link href={autor.instagram} className="hover:text-text-primary" target="_blank">
                          Instagram
                        </Link>
                      )}
                      {autor.twitter && (
                        <Link href={autor.twitter} className="hover:text-text-primary" target="_blank">
                          X
                        </Link>
                      )}
                      {autor.linkedin && (
                        <Link href={autor.linkedin} className="hover:text-text-primary" target="_blank">
                          LinkedIn
                        </Link>
                      )}
                      {autor.github && (
                        <Link href={autor.github} className="hover:text-text-primary" target="_blank">
                          GitHub
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
