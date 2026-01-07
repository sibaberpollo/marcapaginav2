import Link from 'next/link';

interface ListCardProps {
  title: string;
  excerpt: string;
  author: string;
  authorColor: string;
  timeAgo: string;
  tags: string[];
  likes: number;
  comments: number;
  readTime: string;
  slug: string;
  itemCount: number;
}

export default function ListCard({
  title,
  excerpt,
  author,
  authorColor,
  timeAgo,
  tags,
  likes,
  comments,
  readTime,
  slug,
  itemCount,
}: ListCardProps) {
  return (
    <article className="bg-bg-primary rounded-lg border border-surface-2 hover:border-amber-300/50 transition-all duration-300 overflow-hidden group">
      <Link href={`/articulo/${slug}`} className="block">
        {/* Header con badge de lista */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 text-xs font-bold">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                {itemCount} items
              </span>
              <span className="text-xs text-text-secondary">{readTime}</span>
            </div>
            <span className="text-xs text-text-secondary">{timeAgo}</span>
          </div>

          <h2 className="text-lg font-bold leading-snug mb-2 group-hover:text-amber-600 transition-colors">
            {title}
          </h2>

          <p className="text-sm text-text-secondary line-clamp-2 mb-3">
            {excerpt}
          </p>
        </div>

        {/* Preview visual de la lista */}
        <div className="px-4 pb-3">
          <div className="flex gap-1.5">
            {Array.from({ length: Math.min(itemCount, 5) }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
            {itemCount > 5 && (
              <div className="flex-1 h-1.5 rounded-full bg-surface-2 flex items-center justify-center">
                <span className="text-[8px] text-text-secondary">+{itemCount - 5}</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-surface-2 bg-surface/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 ${authorColor} rounded-full`}></div>
            <span className="text-sm font-medium">{author}</span>
          </div>
          <div className="flex items-center gap-4 text-text-secondary">
            <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-xs">{likes}</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-xs">{comments}</span>
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {tags.map((tag) => (
            <span key={tag} className="text-xs text-text-secondary bg-surface px-2 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
