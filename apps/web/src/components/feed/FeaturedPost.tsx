import Link from 'next/link';

interface FeaturedPostProps {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  slug?: string;
  badge?: string;
}

export default function FeaturedPost({
  title,
  excerpt,
  author,
  date,
  readTime,
  slug = '#',
  badge = 'DESTACADO',
}: FeaturedPostProps) {
  const href = slug === '#' ? '#' : `/articulo/${slug}`;

  return (
    <article className="bg-bg-primary rounded-lg overflow-hidden border border-surface-2 hover:border-brand-gray/30 transition-colors">
      <div className="bg-brand-black-static text-brand-white-static px-5 py-4">
        <span className="badge bg-brand-yellow text-black border-none text-xs font-semibold mb-3">
          {badge}
        </span>
        <h2 className="text-xl sm:text-2xl font-bold leading-tight mb-2">
          <Link href={href} className="hover:text-brand-gray transition-colors">
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
        <span className="text-xs font-mono text-text-secondary">{readTime}</span>
      </div>
    </article>
  );
}
