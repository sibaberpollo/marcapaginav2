'use client';

import { useState } from 'react';
import { Chapter } from '@/lib/previews';

interface ChapterReaderProps {
  chapters: Chapter[];
  purchaseUrl: string;
  purchaseLabel?: string;
}

export default function ChapterReader({ chapters, purchaseUrl, purchaseLabel }: ChapterReaderProps) {
  const [activeChapter, setActiveChapter] = useState(0);

  const chapter = chapters[activeChapter];
  const isLastChapter = activeChapter === chapters.length - 1;

  return (
    <section id="capitulos" className="max-w-4xl mx-auto px-4 py-8">
      {/* Chapter navigation tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {chapters.map((ch, idx) => (
          <button
            key={ch.number}
            onClick={() => setActiveChapter(idx)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeChapter === idx
                ? 'bg-blue-600 text-white'
                : 'bg-surface text-text-secondary hover:bg-surface-2'
            }`}
          >
            Capítulo {ch.number}
          </button>
        ))}
      </div>

      {/* Chapter header */}
      <header className="mb-8 pb-4 border-b border-surface-2">
        <div className="flex items-center gap-3 text-sm text-text-secondary mb-3">
          <span className="px-3 py-1 bg-blue-600 text-white rounded-full font-semibold text-xs tracking-wide uppercase">
            Capítulo {chapter.number}
          </span>
          {chapter.subtitle && <span>{chapter.subtitle}</span>}
        </div>
        {chapter.title && (
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
            {chapter.title}
          </h2>
        )}
        {chapter.pov && (
          <p className="text-lg text-brand-gray mt-2 italic">{chapter.pov}</p>
        )}
      </header>

      {/* Chapter content */}
      <div
        className="article-content prose prose-lg md:prose-xl max-w-none prose-p:text-text-secondary prose-p:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: chapter.content }}
      />

      {/* Navigation / CTA */}
      <div className="mt-12 pt-8 border-t border-surface-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Previous chapter */}
          <button
            onClick={() => setActiveChapter((prev) => Math.max(0, prev - 1))}
            disabled={activeChapter === 0}
            className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Capítulo anterior
          </button>

          {/* Next chapter or CTA */}
          {isLastChapter ? (
            <a
              href={purchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-yellow text-brand-black-static font-bold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {purchaseLabel || '¿Te gustó? Compra la novela completa'}
            </a>
          ) : (
            <button
              onClick={() => setActiveChapter((prev) => Math.min(chapters.length - 1, prev + 1))}
              className="flex items-center gap-2 px-4 py-2 text-brand-yellow hover:underline transition-colors font-medium"
            >
              Siguiente capítulo
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* End of preview notice */}
      {isLastChapter && (
        <div className="mt-8 p-6 bg-gradient-to-r from-amber-950/20 to-transparent border border-amber-500/30 rounded-xl">
          <p className="text-center text-text-secondary">
            <span className="block text-lg font-semibold text-text-primary mb-2">
              Fin del preview
            </span>
            ¿Quieres saber cómo continúa la historia? La novela completa está disponible para compra.
          </p>
        </div>
      )}
    </section>
  );
}
