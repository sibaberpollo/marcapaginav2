import Link from 'next/link';

interface FeaturedPostProps {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
  readTime: string;
  slug?: string;
}

export default function FeaturedPost({
  title,
  excerpt,
  author,
  date,
  likes,
  comments,
  readTime,
  slug = '#',
}: FeaturedPostProps) {
  const href = slug === '#' ? '#' : `/articulo/${slug}`;

  return (
    <article className="bg-bg-primary rounded-lg overflow-hidden border border-surface-2 hover:border-brand-gray/30 transition-colors">
      <div className="bg-brand-black-static text-brand-white-static px-5 py-4">
        <span className="badge bg-brand-yellow text-black border-none text-xs font-semibold mb-3">
          DESTACADO
        </span>
        <h2 className="text-xl sm:text-2xl font-bold leading-tight mb-2">
          <Link href={href} className="hover:text-brand-yellow transition-colors">
            {title}
          </Link>
        </h2>
        <p className="text-brand-white-static text-sm line-clamp-2">{excerpt}</p>
      </div>
      <div className="px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-gray rounded-full"></div>
          <div>
            <span className="text-sm font-medium">{author}</span>
            <span className="text-xs text-text-secondary ml-2">{date}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-text-secondary">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {likes}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {comments}
          </span>
          <span className="text-xs font-mono">{readTime}</span>
        </div>
      </div>
    </article>
  );
}
