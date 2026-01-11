import Link from 'next/link';
import Image from 'next/image';
import { NovelPreview } from '@/lib/previews';

interface PreviewHeroProps {
  preview: NovelPreview;
}

export default function PreviewHero({ preview }: PreviewHeroProps) {
  return (
    <section className="max-w-4xl mx-auto px-4 pt-2 pb-8">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          {/* Cover image */}
          {preview.coverImage && (
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="relative w-48 md:w-56 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10">
                <Image
                  src={preview.coverImage}
                  alt={`Portada de ${preview.title}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          <div className="flex-1">
            {/* Genre tags - mejor contraste */}
            <div className="flex flex-wrap gap-2 mb-4">
              {preview.genre.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-amber-500 text-amber-950 rounded-full"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary mb-3 tracking-tight">
              {preview.title}
            </h1>

            {/* Author */}
            <p className="text-lg md:text-xl text-text-secondary mb-6">
              <span className="text-brand-gray">por</span>{' '}
              <span className="font-semibold text-text-primary">{preview.author.name}</span>
            </p>

            {/* Synopsis */}
            <div
              className="prose prose-base md:prose-lg max-w-none text-text-secondary mb-8 prose-p:text-text-secondary prose-p:mb-3 prose-em:text-text-primary prose-em:not-italic prose-em:font-medium"
              dangerouslySetInnerHTML={{ __html: preview.synopsis }}
            />

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <a
                href={preview.purchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-yellow text-brand-black-static font-bold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {preview.purchaseLabel || 'Comprar novela completa'}
              </a>
              <Link
                href="#capitulos"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-surface-2 text-text-primary font-semibold rounded-lg hover:bg-surface hover:border-brand-gray/50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Leer preview ({preview.chapters.length} capítulos)
              </Link>
            </div>

            {/* Disclaimer */}
            {preview.disclaimer && (
              <p className="text-sm text-brand-gray italic border-l-2 border-amber-500/50 pl-4">
                {preview.disclaimer}
              </p>
            )}
          </div>
        </div>
    </section>
  );
}
