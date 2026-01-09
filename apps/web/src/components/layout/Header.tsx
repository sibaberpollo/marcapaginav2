'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import ThemeToggle from '../ui/ThemeToggle';

export default function Header() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Ocultar el header global en los relatos o páginas de Transtextos
  if (pathname.startsWith('/relato') || pathname.startsWith('/transtextos')) {
    return null;
  }

  return (
    <>
      {/* Header - positioned below the banner */}
      <header
        className={`fixed top-0 left-0 right-0 bg-brand-yellow text-brand-black-static z-50 transition-transform duration-300 ${hidden ? '-translate-y-[56px]' : 'translate-y-0'
          }`}
      >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/Logo_M-1-cropped.svg"
              alt="Marcapágina"
              width={180}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Search
          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar relatos, autores, noticias..."
                className="w-full bg-brand-black-static/10 border border-brand-black-static/20 rounded-lg px-4 py-2 text-sm placeholder-brand-gray focus:outline-none focus:border-brand-black-static focus:bg-brand-black-static/20 transition-all"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-gray font-mono bg-brand-black-static/10 px-1.5 py-0.5 rounded">
                ⌘K
              </kbd>
            </div>
          </div>
          */}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/marcapagina.page/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-brand-black-static/10 rounded-lg transition-colors"
              aria-label="Síguenos en Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <ThemeToggle />
            {/* Write button
            <Link
              href="#"
              className="btn btn-sm bg-brand-black-static text-brand-yellow border-none hover:bg-brand-gray"
            >
              Escribir
            </Link>
            */}
            {/* User avatar
            <div className="w-8 h-8 bg-brand-black-static rounded-full cursor-pointer hover:ring-2 hover:ring-brand-black-static/50 transition-all"></div>
            */}
          </div>
        </div>
      </div>
      </header>

      {/* Spacer to push content down - header height (56px) */}
      <div className="h-14" />
    </>
  );
}
