import Link from 'next/link';
import { fetchSanity } from '@/lib/sanity';

type LatestTranstexto = {
  slug: string;
  title: string;
  summary?: string;
  publishedAt?: string;
  author?: string;
};

async function getLatestTranstexto(): Promise<LatestTranstexto | null> {
  try {
    const query = `*[_type == "relato" && status == "published" && site->slug.current == "transtextos"] | order(coalesce(date + "T00:00:00Z", publishedAt) desc)[0]{
      "slug": slug.current,
      title,
      "summary": summary,
      "publishedAt": coalesce(date, publishedAt),
      "author": author->name
    }`;

    const result = await fetchSanity<LatestTranstexto | null>(query);
    return result;
  } catch (error) {
    console.error('Error fetching latest transtexto:', error);
    return null;
  }
}

function formatDate(isoDate?: string): string {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
  });
}

export default async function LatestNarrativaPost() {
  const post = await getLatestTranstexto();

  if (!post) {
    return null;
  }

  return (
    <article className="bg-bg-primary rounded-lg overflow-hidden border border-surface-2 hover:border-orange-400/50 transition-colors">
      {/* Header with orange accent */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4">
        <div className="flex items-center gap-3 mb-3">
          {/* T. icon in black circle */}
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm" style={{ fontFamily: '"Times New Roman", Times, serif' }}>T.</span>
          </div>
          <span className="text-white/90 text-xs font-semibold uppercase tracking-wider">
            Narrativa
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold leading-tight text-white mb-3">
          <Link
            href={`/relato/${post.slug}`}
            className="hover:text-orange-100 transition-colors"
          >
            {post.title}
          </Link>
        </h2>

        {/* Square Ad */}
        <div className="bg-black/20 rounded-lg p-3 mb-3 flex items-center justify-center min-h-[120px]">
          <span className="text-white/60 text-xs uppercase tracking-wider">Publicidad</span>
        </div>

        {post.summary && (
          <p className="text-white/80 text-sm line-clamp-2">{post.summary}</p>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 flex items-center justify-between bg-orange-50 dark:bg-orange-950/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-200 rounded-full"></div>
          <div>
            {post.author && (
              <span className="text-sm font-medium text-text-primary">{post.author}</span>
            )}
            {post.publishedAt && (
              <span className="text-xs text-text-secondary ml-2">{formatDate(post.publishedAt)}</span>
            )}
          </div>
        </div>
        <Link
          href="/transtextos"
          className="text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors"
        >
          Ver más relatos →
        </Link>
      </div>
    </article>
  );
}
