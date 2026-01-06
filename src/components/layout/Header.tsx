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

  // Banner height (90px) + header height (56px) = 146px total
  const bannerHeight = 90;
  const headerHeight = 56;

  return (
    <>
      {/* Top Ad Banner - above header, scrolls away with header */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-surface-2 transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center h-[90px]">
          <div className="bg-surface border border-dashed border-brand-gray/30 rounded-lg w-full max-w-[728px] h-[90px] flex items-center justify-center">
            <span className="text-xs text-brand-gray uppercase tracking-wider">
              Publicidad · 728x90
            </span>
          </div>
        </div>
      </div>

      {/* Header - positioned below the banner */}
      <header
        className={`fixed top-[90px] left-0 right-0 bg-brand-yellow text-brand-black-static z-50 transition-transform duration-300 ${hidden ? '-translate-y-[146px]' : 'translate-y-0'
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
            {/* Search button mobile
            <button className="md:hidden p-2 hover:bg-brand-black-static/10 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            */}
            {/* Notifications
            <Link
              href="#"
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-sm font-medium hover:bg-brand-black-static/10 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </Link>
            */}
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

      {/* Spacer to push content down - banner (90px) + header (56px) = 146px */}
      <div className="h-[146px]" />
    </>
  );
}
