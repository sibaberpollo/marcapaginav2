'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function RelatoHeader() {
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const adRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (showSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    if (!adRef.current) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).adsbygoogle.push({});
    } catch (err) {
      console.error('Adsense relato header ad error', err);
    }
  }, []);

  return (
    <>
      {/* Top Ad Banner - above header, scrolls away with header */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-surface-2 transition-transform duration-300 ${
          hidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 py-1 flex items-center justify-center h-[40px] md:h-[70px]">
          <ins
            ref={adRef}
            className="adsbygoogle block w-full max-w-[728px] bg-surface rounded-lg border border-surface-2"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-1422077668654301"
            data-ad-slot="2557954886"
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
        </div>
      </div>

      {/* Header - positioned below the banner */}
      <header
        className={`fixed top-[40px] md:top-[70px] left-0 right-0 z-50 bg-bg-primary border-b border-surface-2 transition-transform duration-300 ${
          hidden ? '-translate-y-[96px] md:-translate-y-[126px]' : 'translate-y-0'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Volver */}
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-center bg-brand-yellow text-brand-black-static rounded-md font-semibold hover:translate-y-[-1px] transition"
          aria-label="Volver al inicio"
        >
          ←
        </Link>

        {/* Logo central */}
        <Link href="/transtextos" className="flex items-center justify-center">
          <Image
            src="/trantextos.webp"
            alt="Transtextos"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover shadow-sm"
            priority
          />
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/transtextos/autores"
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-surface transition-colors"
          >
            <span>Autores</span>
          </Link>
          <Link
            href="/transtextos"
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-surface transition-colors"
          >
            <span>Todos los relatos</span>
          </Link>

          {/* Buscar */}
          <div className="relative">
            <button
              onClick={() => setShowSearch((prev) => !prev)}
              className="w-10 h-10 flex items-center justify-center rounded-md text-text-primary hover:bg-surface transition"
              aria-label="Buscar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {showSearch && (
              <div className="absolute right-0 mt-2 w-[260px] sm:w-[320px]">
                <div className="bg-bg-primary border border-surface-2 rounded-lg shadow-lg p-2 flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Buscar relatos..."
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                  <kbd className="text-xs text-text-secondary font-mono bg-surface px-1.5 py-0.5 rounded">
                    ⌘K
                  </kbd>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </header>

      {/* Spacer to push content down - banner (40/70px) + header (56px) */}
      <div className="h-[96px] md:h-[126px]" />
    </>
  );
}
