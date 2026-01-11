import Link from 'next/link';
import Image from 'next/image';

interface FeaturedPreviewPostProps {
  title: string;
  author: string;
  genre: string;
  excerpt: string;
  coverImage: string;
  slug: string;
  chaptersCount: number;
}

export default function FeaturedPreviewPost({
  title,
  author,
  genre,
  excerpt,
  coverImage,
  slug,
  chaptersCount,
}: FeaturedPreviewPostProps) {
  return (
    <Link href={`/previews/${slug}`} className="block">
      <article className="bg-bg-primary rounded-lg overflow-hidden border border-surface-2 hover:border-rose-400/50 transition-colors">
        <div className="relative text-brand-black px-5 py-4 overflow-hidden bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20">
          {/* Book pattern background */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.08]"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern id="booksPattern" x="0" y="0" width="120" height="80" patternUnits="userSpaceOnUse">
                {/* Open book shapes */}
                <path d="M10 40 L30 35 L30 55 L10 60 Z" stroke="currentColor" strokeWidth="0.5" fill="none" />
                <path d="M30 35 L50 40 L50 60 L30 55 Z" stroke="currentColor" strokeWidth="0.5" fill="none" />
                <path d="M70 20 L90 15 L90 35 L70 40 Z" stroke="currentColor" strokeWidth="0.5" fill="none" />
                <path d="M90 15 L110 20 L110 40 L90 35 Z" stroke="currentColor" strokeWidth="0.5" fill="none" />
                <path d="M40 60 L60 55 L60 75 L40 80 Z" stroke="currentColor" strokeWidth="0.5" fill="none" />
                <path d="M60 55 L80 60 L80 80 L60 75 Z" stroke="currentColor" strokeWidth="0.5" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#booksPattern)" />
          </svg>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-start gap-4">
              {/* Cover image */}
              <div className="flex-shrink-0">
                <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-md overflow-hidden shadow-lg border border-rose-200 dark:border-rose-700">
                  <Image
                    src={coverImage}
                    alt={title}
                    width={96}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge bg-rose-600 text-white border-none text-xs font-semibold">
                    PREVIEW
                  </span>
                  <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                    {genre}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold leading-tight mb-1 hover:text-rose-600 transition-colors line-clamp-2">
                  {title}
                </h2>
                <p className="text-sm text-rose-700 dark:text-rose-300 font-medium mb-2">
                  {author}
                </p>
                <p className="text-text-secondary text-sm line-clamp-2 hidden sm:block">
                  {excerpt}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-5 py-3 flex items-center justify-between border-t border-surface-2 bg-rose-50/50 dark:bg-rose-900/10">
          <span className="text-sm text-rose-600 dark:text-rose-400 font-medium">
            Lee {chaptersCount} capítulos gratis →
          </span>
          <span className="text-xs text-text-secondary font-mono">novela</span>
        </div>
      </article>
    </Link>
  );
}
