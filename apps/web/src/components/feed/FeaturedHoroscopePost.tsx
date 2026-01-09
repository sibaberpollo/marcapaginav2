import Link from 'next/link';
import Image from 'next/image';

interface FeaturedHoroscopePostProps {
  signName: string;
  signSymbol: string;
  author: string;
  authorImage: string;
  month: string;
  excerpt: string;
}

export default function FeaturedHoroscopePost({
  signName,
  signSymbol,
  author,
  authorImage,
  month,
  excerpt,
}: FeaturedHoroscopePostProps) {
  return (
    <Link href="/horoscopo" className="block">
      <article className="bg-bg-primary rounded-lg overflow-hidden border border-surface-2 hover:border-purple-400/50 transition-colors">
        <div className="relative text-brand-black px-5 py-4 overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
          {/* Stars pattern background */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.15]"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern id="starsPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                {/* Stars */}
                <circle cx="10" cy="10" r="1" fill="currentColor" />
                <circle cx="50" cy="20" r="1.5" fill="currentColor" />
                <circle cx="80" cy="15" r="1" fill="currentColor" />
                <circle cx="25" cy="45" r="1.2" fill="currentColor" />
                <circle cx="70" cy="50" r="1" fill="currentColor" />
                <circle cx="90" cy="40" r="0.8" fill="currentColor" />
                <circle cx="15" cy="75" r="1" fill="currentColor" />
                <circle cx="45" cy="80" r="1.3" fill="currentColor" />
                <circle cx="85" cy="85" r="1" fill="currentColor" />
                <circle cx="60" cy="70" r="0.8" fill="currentColor" />
                <circle cx="35" cy="30" r="0.8" fill="currentColor" />
                <circle cx="95" cy="65" r="1" fill="currentColor" />
                {/* Constellation lines */}
                <path d="M10 10 L25 45 L45 80" stroke="currentColor" strokeWidth="0.3" fill="none" opacity="0.5" />
                <path d="M50 20 L70 50 L85 85" stroke="currentColor" strokeWidth="0.3" fill="none" opacity="0.5" />
                <path d="M80 15 L90 40 L60 70" stroke="currentColor" strokeWidth="0.3" fill="none" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#starsPattern)" />
          </svg>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge bg-purple-600 text-white border-none text-xs font-semibold">
                    HORÓSCOPO LITERARIO
                  </span>
                  <span className="badge bg-purple-100 text-purple-800 dark:bg-purple-800/30 dark:text-purple-300 border-none text-xs">
                    {month}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold leading-tight mb-2 flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl">{signSymbol}</span>
                  <span className="hover:text-purple-600 transition-colors">{signName}</span>
                </h2>
                <p className="text-text-secondary text-sm line-clamp-2 mb-3">{excerpt}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                  Guía: {author}
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-purple-200 dark:border-purple-700 shadow-lg">
                  <Image
                    src={authorImage}
                    alt={author}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-5 py-3 flex items-center justify-between border-t border-surface-2 bg-purple-50/50 dark:bg-purple-900/10">
          <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
            Descubre tu predicción literaria →
          </span>
          <span className="text-xs text-text-secondary font-mono">12 signos</span>
        </div>
      </article>
    </Link>
  );
}
