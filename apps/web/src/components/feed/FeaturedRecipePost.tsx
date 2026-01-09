import Link from 'next/link';
import Avatar from './Avatar';

interface FeaturedRecipePostProps {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  slug?: string;
  badge?: string;
  recipeType?: 'drink' | 'food';
}

export default function FeaturedRecipePost({
  title,
  excerpt,
  author,
  date,
  readTime,
  slug = '#',
  badge = 'A PIE DE PÁGINA',
  recipeType = 'drink',
}: FeaturedRecipePostProps) {
  const href = slug === '#' ? '#' : `/articulo/${slug}`;

  return (
    <article className="bg-bg-primary rounded-lg overflow-hidden border border-surface-2 hover:border-brand-gray/30 transition-colors">
      <div className="relative text-brand-black px-5 py-4 overflow-hidden">
        {/* Recipe pattern background */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.06]"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="recipePattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              {/* Cocktail glass */}
              <path d="M30 20 L40 50 L40 70 L35 70 L35 75 L45 75 L45 70 L40 70 L40 50 L50 20 Z"
                stroke="currentColor" strokeWidth="1.5" fill="none" />
              <ellipse cx="40" cy="20" rx="10" ry="3" stroke="currentColor" strokeWidth="1" fill="none" />

              {/* Lime/citrus slice */}
              <circle cx="90" cy="35" r="12" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M90 23 L90 47" stroke="currentColor" strokeWidth="1" />
              <path d="M78 35 L102 35" stroke="currentColor" strokeWidth="1" />
              <path d="M82 27 L98 43" stroke="currentColor" strokeWidth="1" />
              <path d="M82 43 L98 27" stroke="currentColor" strokeWidth="1" />

              {/* Mint leaves */}
              <ellipse cx="20" cy="90" rx="8" ry="5" stroke="currentColor" strokeWidth="1" fill="none" transform="rotate(-30 20 90)" />
              <ellipse cx="28" cy="85" rx="7" ry="4" stroke="currentColor" strokeWidth="1" fill="none" transform="rotate(15 28 85)" />
              <path d="M20 90 L20 100" stroke="currentColor" strokeWidth="1" />

              {/* Sugar cubes */}
              <rect x="70" y="80" width="10" height="10" stroke="currentColor" strokeWidth="1" fill="none" />
              <rect x="75" y="75" width="10" height="10" stroke="currentColor" strokeWidth="1" fill="none" />

              {/* Ice cubes */}
              <path d="M100 90 L105 85 L115 85 L115 95 L110 100 L100 100 Z"
                stroke="currentColor" strokeWidth="1" fill="none" />

              {/* Bubbles */}
              <circle cx="55" cy="60" r="3" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <circle cx="60" cy="55" r="2" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <circle cx="52" cy="52" r="1.5" stroke="currentColor" strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#recipePattern)" />
        </svg>

        {/* Content with relative positioning to appear above the pattern */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge bg-brand-yellow text-black border-none text-xs font-semibold">
              {badge}
            </span>
            <span className="badge bg-amber-100 text-amber-800 border-none text-xs">
              {recipeType === 'drink' ? 'Trago' : 'Receta'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold leading-tight mb-2">
            <Link href={href} className="hover:text-brand-gray transition-colors">
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
        <span className="text-xs font-mono text-text-secondary">{readTime}</span>
      </div>
    </article>
  );
}
