import Link from 'next/link';
import { PreviewSummary } from '@/lib/previews';

interface PreviewCardProps {
  preview: PreviewSummary;
}

export default function PreviewCard({ preview }: PreviewCardProps) {
  return (
    <Link
      href={`/previews/${preview.slug}`}
      className="group block bg-bg-primary border border-surface-2 rounded-xl overflow-hidden hover:border-brand-gray/50 transition-all duration-300 hover:shadow-lg"
    >
      <div className="p-6 space-y-4">
        {/* Genre tags */}
        <div className="flex flex-wrap gap-2">
          {preview.genre.slice(0, 2).map((g) => (
            <span
              key={g}
              className="px-2 py-1 text-xs font-bold bg-amber-500 text-amber-950 rounded"
            >
              {g}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-text-primary group-hover:text-brand-yellow transition-colors">
          {preview.title}
        </h3>

        {/* Author */}
        <p className="text-sm text-text-secondary">
          por <span className="font-medium text-text-primary">{preview.author.name}</span>
        </p>

        {/* Synopsis excerpt */}
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
          {preview.synopsis}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-surface-2">
          <span className="text-xs text-text-secondary">
            {preview.chapterCount} capítulos disponibles
          </span>
          <span className="text-xs font-medium text-brand-yellow group-hover:underline">
            Leer preview →
          </span>
        </div>
      </div>
    </Link>
  );
}
