import Link from 'next/link';
import Avatar from './Avatar';

interface FeaturedMapPostProps {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
  readTime: string;
  slug?: string;
  badge?: string;
}

export default function FeaturedMapPost({
  title,
  excerpt,
  author,
  date,
  likes,
  comments,
  readTime,
  slug = '#',
  badge = 'A PIE DE PÁGINA',
}: FeaturedMapPostProps) {
  const href = slug === '#' ? '#' : `/articulo/${slug}`;

  return (
    <article className="bg-bg-primary rounded-lg overflow-hidden border border-surface-2 hover:border-brand-gray/30 transition-colors">
      <div className="relative text-brand-black px-5 py-4 overflow-hidden">
        {/* Map pattern background */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.08]"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="mapPattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              {/* Main streets - horizontal */}
              <path d="M0 40 L200 40" stroke="currentColor" strokeWidth="3" fill="none" />
              <path d="M0 100 L200 100" stroke="currentColor" strokeWidth="4" fill="none" />
              <path d="M0 160 L200 160" stroke="currentColor" strokeWidth="2" fill="none" />

              {/* Main streets - vertical */}
              <path d="M50 0 L50 200" stroke="currentColor" strokeWidth="3" fill="none" />
              <path d="M120 0 L120 200" stroke="currentColor" strokeWidth="4" fill="none" />
              <path d="M180 0 L180 200" stroke="currentColor" strokeWidth="2" fill="none" />

              {/* Secondary streets - horizontal */}
              <path d="M0 20 L200 20" stroke="currentColor" strokeWidth="1" fill="none" />
              <path d="M0 70 L200 70" stroke="currentColor" strokeWidth="1" fill="none" />
              <path d="M0 130 L200 130" stroke="currentColor" strokeWidth="1" fill="none" />
              <path d="M0 185 L200 185" stroke="currentColor" strokeWidth="1" fill="none" />

              {/* Secondary streets - vertical */}
              <path d="M25 0 L25 200" stroke="currentColor" strokeWidth="1" fill="none" />
              <path d="M85 0 L85 200" stroke="currentColor" strokeWidth="1" fill="none" />
              <path d="M145 0 L145 200" stroke="currentColor" strokeWidth="1" fill="none" />

              {/* Diagonal avenue */}
              <path d="M0 0 L200 200" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M0 200 L80 120" stroke="currentColor" strokeWidth="1.5" fill="none" />

              {/* River/canal curve */}
              <path d="M0 80 Q50 60 100 80 T200 80" stroke="currentColor" strokeWidth="5" fill="none" opacity="0.5" />

              {/* Parks/plazas */}
              <circle cx="50" cy="100" r="12" fill="currentColor" opacity="0.3" />
              <circle cx="120" cy="40" r="8" fill="currentColor" opacity="0.3" />
              <rect x="140" y="150" width="20" height="15" fill="currentColor" opacity="0.2" />

              {/* Small blocks */}
              <rect x="55" y="45" width="25" height="20" fill="currentColor" opacity="0.15" />
              <rect x="125" y="105" width="15" height="20" fill="currentColor" opacity="0.15" />
              <rect x="10" y="145" width="30" height="10" fill="currentColor" opacity="0.15" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapPattern)" />
        </svg>

        {/* Content with relative positioning to appear above the pattern */}
        <div className="relative z-10">
          <span className="badge bg-brand-yellow text-black border-none text-xs font-semibold mb-3">
            {badge}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold leading-tight mb-2">
            <Link href={href} className="hover:text-brand-yellow transition-colors">
              {title}
            </Link>
          </h2>
          <p className="text-text-secondary text-sm line-clamp-2">{excerpt}</p>
        </div>
      </div>
      <div className="px-5 py-3 flex items-center justify-between border-t border-surface-2">
        <div className="flex items-center gap-3">
          <Avatar name={author} size="sm" />
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
