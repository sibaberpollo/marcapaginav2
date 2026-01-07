import Image from 'next/image';
import Link from 'next/link';

interface MemeCardProps {
  title: string;
  imageUrl: string;
  alt: string;
  slug: string;
}

export default function MemeCard({ title, imageUrl, alt, slug }: MemeCardProps) {
  return (
    <Link href={`/articulo/${slug}`} className="block">
      <article className="bg-bg-primary rounded-lg border border-surface-2 overflow-hidden shadow-sm hover:border-brand-gray/30 transition-colors">
        <div className="px-5 pt-4 pb-3 flex items-center justify-between gap-3">
          <div>
            <span className="badge badge-xs bg-brand-yellow text-brand-black-static border-none uppercase tracking-wide">
              Meme
            </span>
            <h3 className="text-lg font-bold leading-snug mt-2 hover:text-brand-gray transition-colors">{title}</h3>
          </div>
          <span className="text-xs text-text-secondary">Nueva entrada visual</span>
        </div>
        <div className="relative bg-surface">
          <Image
            src={imageUrl}
            alt={alt}
            width={1200}
            height={1200}
            className="w-full h-auto"
            priority
          />
        </div>
      </article>
    </Link>
  );
}
