import Image from 'next/image';

interface MemeCardProps {
  title: string;
  imageUrl: string;
  alt: string;
}

export default function MemeCard({ title, imageUrl, alt }: MemeCardProps) {
  return (
    <article className="bg-bg-primary rounded-lg border border-surface-2 overflow-hidden shadow-sm">
      <div className="px-5 pt-4 pb-3 flex items-center justify-between gap-3">
        <div>
          <span className="badge badge-xs bg-brand-yellow text-brand-black-static border-none uppercase tracking-wide">
            Meme
          </span>
          <h3 className="text-lg font-bold leading-snug mt-2">{title}</h3>
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
  );
}
